import { pool } from "../config/db.config.js";

export class GoodsHistory {
  constructor({
    history_id,
    good_id,
    previous_qty,
    new_qty,
    change_type,
    changed_by,
    remarks,
    timestamp,
  }) {
    this.history_id = history_id;
    this.good_id = good_id;
    this.previous_qty = previous_qty;
    this.new_qty = new_qty;
    this.change_type = change_type;
    this.changed_by = changed_by;
    this.remarks = remarks;
    this.timestamp = timestamp;
  }

  // ➕ Create a new history record
  static async create({
    good_id,
    previous_qty,
    new_qty,
    change_type,
    changed_by,
    remarks,
  }) {
    try {
      const result = await pool.query(
        `
        INSERT INTO inventory.history
        (good_id, previous_qty, new_qty, change_type, changed_by, remarks)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [good_id, previous_qty, new_qty, change_type, changed_by, remarks]
      );
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error creating goods history:", error.message);
      throw error;
    }
  }

  // 🔍 Find all history records for a specific good
  static async findByGoodId(good_id) {
    try {
      const result = await pool.query(
        `
        SELECT h.*, u.name AS changed_by_name
        FROM inventory.history h
        LEFT JOIN auth.users u ON h.changed_by = u.user_id
        WHERE h.good_id = $1
        ORDER BY h.timestamp DESC
        `,
        [good_id]
      );
      return result.rows;
    } catch (error) {
      console.error("❌ Error fetching history:", error.message);
      throw error;
    }
  }

  // 📋 Fetch all history records (optional filters)
  static async findAll(filters = {}) {
    const { change_type, user_id } = filters;
    let query = `SELECT * FROM inventory.history WHERE 1=1`;
    const values = [];

    if (change_type) {
      values.push(change_type);
      query += ` AND change_type = $${values.length}`;
    }

    if (user_id) {
      values.push(user_id);
      query += ` AND changed_by = $${values.length}`;
    }

    query += ` ORDER BY timestamp DESC`;

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("❌ Error fetching history records:", error.message);
      throw error;
    }
  }

  // 🧹 Delete a specific history record
  static async delete(history_id) {
    try {
      await pool.query(`DELETE FROM inventory.history WHERE history_id = $1`, [
        history_id,
      ]);
      return true;
    } catch (error) {
      console.error("❌ Error deleting history:", error.message);
      throw error;
    }
  }
}
