import { pool } from "../config/db.config.js";

export class Transaction {
  constructor({
    transaction_id,
    customer_id,
    good_id,
    quantity,
    type,
    scanned_by,
    photo_url,
    notes,
  }) {
    this.transaction_id = transaction_id;
    this.customer_id = customer_id;
    this.good_id = good_id;
    this.quantity = quantity;
    this.type = type;
    this.scanned_by = scanned_by;
    this.photo_url = photo_url;
    this.notes = notes;
  }

  // ➕ Create new transaction
  static async create({
    customer_id,
    good_id,
    quantity,
    type,
    scanned_by,
    photo_url,
    notes,
  }) {
    try {
      const result = await pool.query(
        `
        INSERT INTO operation.transactions
        (customer_id, good_id, quantity, type, scanned_by, photo_url, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [customer_id, good_id, quantity, type, scanned_by, photo_url, notes]
      );

      return result.rows[0];
    } catch (error) {
      console.error("❌ Error creating transaction:", error.message);
      throw error;
    }
  }

  // 🔍 Find transaction by ID
  static async findById(transaction_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM operation.transactions WHERE transaction_id = $1`,
        [transaction_id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error finding transaction:", error.message);
      throw error;
    }
  }

  // 🔄 Update transaction fields
  static async update(transaction_id, fieldsToUpdate) {
    const keys = Object.keys(fieldsToUpdate);
    if (keys.length === 0) return null;

    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    const values = Object.values(fieldsToUpdate);

    try {
      const result = await pool.query(
        `
        UPDATE operation.transactions
        SET ${setClause}, updated_at = NOW()
        WHERE transaction_id = $${keys.length + 1}
        RETURNING *
        `,
        [...values, transaction_id]
      );

      return result.rows[0];
    } catch (error) {
      console.error("❌ Error updating transaction:", error.message);
      throw error;
    }
  }

  // 🗑️ Delete transaction
  static async delete(transaction_id) {
    try {
      await pool.query(
        `DELETE FROM operation.transactions WHERE transaction_id = $1`,
        [transaction_id]
      );
      return true;
    } catch (error) {
      console.error("❌ Error deleting transaction:", error.message);
      throw error;
    }
  }

  // 📋 Get all transactions (optionally filtered by type or customer)
  static async findAll(filters = {}) {
    const { type, customer_id } = filters;
    let query = `SELECT * FROM operation.transactions WHERE 1=1`;
    const values = [];

    if (type) {
      values.push(type);
      query += ` AND type = $${values.length}`;
    }
    if (customer_id) {
      values.push(customer_id);
      query += ` AND customer_id = $${values.length}`;
    }

    query += " ORDER BY created_at DESC";

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("❌ Error fetching transactions:", error.message);
      throw error;
    }
  }
}
