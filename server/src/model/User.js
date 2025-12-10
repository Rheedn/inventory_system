import { pool } from "../config/db.config.js";

export class User {
  constructor({
    name,
    email,
    password_hash,
    department,
    role = "staff",
    phone_number,
    status = "active",
  }) {
    this.name = name;
    this.email = email;
    this.password_hash = password_hash;
    this.role = role;
    this.department = department;
    this.status = status;
    this.phone_number = phone_number;
  }

  // 🟢 Save new user
  async save() {
    try {
      const result = await pool.query(
        `INSERT INTO auth.users (name, email, password_hash, role, department,status, phone_number)
         VALUES ($1, $2, $3, $4, $5,$6,$7)
         RETURNING *`,
        [
          this.name,
          this.email,
          this.password_hash,
          this.role,
          this.department,
          this.status,
          this.phone_number,
        ]
      );

      const { password_hash, ...rest } = result.rows[0];
      return rest;
    } catch (error) {
      console.error("❌ Error saving user:", error.message);
      throw error;
    }
  }

  // 🔵 Find by email
  static async findUserByEmail(email) {
    try {
      const result = await pool.query(
        `SELECT * FROM auth.users WHERE email = $1`,
        [email]
      );
      if (result.rowCount === 0) return null;
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error finding user by email:", error.message);
      throw error;
    }
  }

  // 🟡 Find by ID
  static async findUserById(user_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM auth.users WHERE user_id = $1`,
        [user_id]
      );
      if (result.rowCount === 0) return null;

      const { password_hash, ...rest } = result.rows[0];
      return rest;
    } catch (error) {
      console.error("❌ Error finding user by ID:", error.message);
      throw error;
    }
  }

  // 🟣 Update any user fields (partial update)
  static async updateUser(user_id, fieldsToUpdate = {}) {
    try {
      const allowedFields = [
        "name",
        "email",
        "password_hash",
        "role",
        "phone_number",
        "department",
        "status",
      ];
      const setClauses = [];
      const values = [];
      let index = 1;

      for (const key in fieldsToUpdate) {
        if (allowedFields.includes(key)) {
          setClauses.push(`${key} = $${index}`);
          values.push(fieldsToUpdate[key]);
          index++;
        }
      }
      console.log(fieldsToUpdate);
      if (setClauses.length === 0) {
        throw new Error("No valid fields to update");
      }

      // Add updated_at timestamp automatically
      setClauses.push(`updated_at = NOW()`);

      const query = `
        UPDATE auth.users
        SET ${setClauses.join(", ")}
        WHERE user_id = $${index}
        RETURNING *;
      `;
      values.push(user_id);

      const result = await pool.query(query, values);
      if (result.rowCount === 0) return null;

      const { password_hash, ...rest } = result.rows[0];
      return rest;
    } catch (error) {
      console.error("❌ Error updating user:", error.message);
      throw error;
    }
  }
}
