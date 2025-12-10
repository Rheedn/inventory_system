import { pool } from "../config/db.config.js";
import { ActivityLog } from "../model/Activity_log.js";

export const fetchLogs = async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT * FROM operation.activity_logs ORDER BY created_at DESC `
    );
    if (parseInt(response.rowCount) <= 0) {
      return res.status(200).json({
        success: true,
        message: "No logs recorded yet",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Log fetched",
      logs: response.rows,
    });
  } catch (error) {
    console.log("Error fetching logs: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getLog = async (req, res) => {
  const { log_id } = req.params;
  try {
    const result = await ActivityLog.findById(log_id);
    return res.status(200).json({
      success: true,
      message: "Log fetched",
      log: result
    })
  } catch (error) {
    console.log("error finding log")
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}
