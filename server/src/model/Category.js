import { pool } from "../config/db.config.js";

export class Category {
  constructor({ category_id, name, description }) {
    this.category_id = category_id;
    this.name = name;
    this.description = description;
  }

  // ➕ Create new category
  static async create({ name, description }) {
    try {
      const result = await pool.query(
        `
        INSERT INTO inventory.category (name, description)
        VALUES ($1, $2)
        RETURNING *
        `,
        [name, description]
      );
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error creating category:", error.message);
      throw error;
    }
  }

  // 🔍 Find by ID
  static async findById(category_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM inventory.category WHERE category_id = $1`,
        [category_id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error finding category:", error.message);
      throw error;
    }
  }

  // 📋 Get all categories
  static async findAll() {
    try {
      const result = await pool.query(
        `SELECT * FROM inventory.category ORDER BY name ASC`
      );
      return result.rows;
    } catch (error) {
      console.error("❌ Error fetching categories:", error.message);
      throw error;
    }
  }

  // ✏️ Update category
  static async update(category_id, fieldsToUpdate) {
    try {
      const keys = Object.keys(fieldsToUpdate);
      if (keys.length === 0) return null;

      const setClause = keys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");

      const values = Object.values(fieldsToUpdate);
      values.push(category_id);

      const result = await pool.query(
        `
        UPDATE inventory.category
        SET ${setClause}
        WHERE category_id = $${values.length}
        RETURNING *
        `,
        values
      );

      return result.rows[0];
    } catch (error) {
      console.error("❌ Error updating category:", error.message);
      throw error;
    }
  }

  // 🗑️ Delete category
  static async delete(category_id) {
    try {
      await pool.query(
        `DELETE FROM inventory.category WHERE category_id = $1`,
        [category_id]
      );
      return true;
    } catch (error) {
      console.error("❌ Error deleting category:", error.message);
      throw error;
    }
  }
}
