import { pool } from "../config/db.config.js";
import { User } from "./User.js";

export class ActivityLog {
  constructor({
    severity,
    user_id,
    action,
    details,
    ip_address,
    user_agent = null,
    category = null,
    affected_resource = null,
    resource_type = null,
  }) {
    this.severity = severity;
    this.user_id = user_id;
    this.action = action;
    this.details = details;
    this.ip_address = ip_address;
    this.user_agent = user_agent;
    this.category = category;
    this.affected_resource = affected_resource;
    this.resource_type = resource_type;
  }

  // ➕ Create new log entry (auto-fetch user info)
  async create() {
    try {
      // ✅ Fetch user details (to store snapshot in log)
      const user = await User.findUserById(this.user_id);
      const user_name = user?.name || "Unknown";
      const user_email = user?.email || "Unknown";
      const user_role = user?.role || "staff";

      const result = await pool.query(
        `
        INSERT INTO operation.activity_logs
        (user_id, user_name, user_email, user_role, action, severity, details, ip_address, user_agent, category, affected_resource, resource_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
        `,
        [
          this.user_id,
          user_name,
          user_email,
          user_role,
          this.action,
          this.severity,
          this.details,
          this.ip_address,
          this.user_agent,
          this.category,
          this.affected_resource,
          this.resource_type,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error creating activity log:", error.message);
      throw error;
    }
  }

  // 🔍 Find log by ID
  static async findById(log_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM operation.activity_logs WHERE log_id = $1`,
        [log_id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error finding log:", error.message);
      throw error;
    }
  }

  // 📋 Get all logs (optionally filter by user, role, or action)
  static async findAll(filters = {}) {
    const { user_id, user_role, action } = filters;
    let query = `SELECT * FROM operation.activity_logs WHERE 1=1`;
    const values = [];

    if (user_id) {
      values.push(user_id);
      query += ` AND user_id = $${values.length}`;
    }

    if (user_role) {
      values.push(user_role);
      query += ` AND user_role = $${values.length}`;
    }

    if (action) {
      values.push(action);
      query += ` AND action = $${values.length}`;
    }

    query += " ORDER BY created_at DESC";

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("❌ Error fetching logs:", error.message);
      throw error;
    }
  }

  // 🧹 Delete a specific log
  static async delete(log_id) {
    try {
      await pool.query(
        `DELETE FROM operation.activity_logs WHERE log_id = $1`,
        [log_id]
      );
      return true;
    } catch (error) {
      console.error("❌ Error deleting log:", error.message);
      throw error;
    }
  }

  // 🧾 Clear all logs (for admin only)
  static async clearAll() {
    try {
      await pool.query(`TRUNCATE TABLE operation.activity_logs RESTART IDENTITY`);
      return true;
    } catch (error) {
      console.error("❌ Error clearing logs:", error.message);
      throw error;
    }
  }
}
