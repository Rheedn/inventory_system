import { pool } from "../config/db.config.js";
import { User } from "../model/User.js";

export const fetchStat = async (req, res) => {
  const { user_id } = req.query;

  try {
    const user = await User.findUserById(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Build query correctly
    const requestQuery =
      user.role === "admin"
        ? `SELECT COUNT(*) FROM operation.requests`
        : `SELECT COUNT(*) FROM operation.requests WHERE user_id = $1 AND status = 'pending'`;

    const requestParams = user.role === "admin" ? [] : [user_id];

    // Run parallel queries cleanly
    const [totalEquipmentResult, pendingRequestsResult] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM inventory.equipment`),
      pool.query(requestQuery, requestParams),
    ]);

    const total_equipment = parseInt(totalEquipmentResult.rows[0].count, 10);
    const pending_requests = parseInt(pendingRequestsResult.rows[0].count, 10);

    return res.status(200).json({
      success: true,
      message: "stat fetched successfully",
      stats: {
        total_equipment,
        pending_requests,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Failed to fetch statistics." });
  }
};
