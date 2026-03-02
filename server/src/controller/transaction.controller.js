import { pool } from "../config/db.config.js";

// Checkout controller: creates a transaction and decrements equipment quantity atomically
export const checkout = async (req, res) => {
  const { request_id, equipment_id, quantity = 1, qr_code } = req.body;
  const activeUser = req.user || null;

  if (!equipment_id || !request_id) {
    return res.status(400).json({ success: false, message: "Missing equipment_id or request_id" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock equipment row to avoid race conditions
    const eqRes = await client.query(
      `SELECT quantity FROM inventory.equipment WHERE equipment_id = $1 FOR UPDATE`,
      [equipment_id]
    );
    if (!eqRes.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Equipment not found" });
    }

    const available = parseInt(eqRes.rows[0].quantity, 10);
    if (available < quantity) {
      await client.query("ROLLBACK");
      return res.status(400).json({ success: false, message: "Insufficient equipment quantity" });
    }

    const newQty = available - quantity;

    // Determine recipient user for this request (user who made the request)
    const reqRes = await client.query(
      `SELECT user_id FROM operation.requests WHERE request_id = $1 LIMIT 1`,
      [request_id]
    );
    const recipientUserId = reqRes.rows?.[0]?.user_id || null;

    // Check if this equipment has already been checked out for this request
    try {
      const existing = await client.query(
        `SELECT transaction_id FROM operation.transactions WHERE equipment_id = $1 AND type = 'outgoing' AND notes LIKE $2 LIMIT 1`,
        [equipment_id, `%${request_id}%`]
      );
      if (existing.rows.length) {
        await client.query("ROLLBACK");
        return res.status(409).json({ success: false, message: "This equipment has already been checked out for the specified request" });
      }
    } catch (err) {
      console.error("Error checking existing transaction:", err);
      await client.query("ROLLBACK");
      return res.status(500).json({ success: false, message: "Failed to verify existing transaction" });
    }

    // Insert transaction record using actual table columns
    const txRes = await client.query(
      `INSERT INTO operation.transactions (user_id, equipment_id, quantity, type, scanned_by, equipment_image, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        recipientUserId,
        equipment_id,
        quantity,
        "outgoing",
        activeUser?.user_id || null,
        null,
        `Checked out for request ${request_id} (qr:${qr_code || "-"})`,
      ]
    );

    // Update equipment quantity
    await client.query(
      `UPDATE inventory.equipment SET quantity = $1, updated_at = NOW() WHERE equipment_id = $2`,
      [newQty, equipment_id]
    );

    await client.query("COMMIT");

    return res.status(200).json({ success: true, message: "Checkout completed", transaction: txRes.rows[0], new_quantity: newQty });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Checkout error:", error);
    return res.status(500).json({ success: false, message: "Failed to complete checkout" });
  } finally {
    client.release();
  }
};


export default { checkout };
