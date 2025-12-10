import { pool } from "../config/db.config.js";

export class Customer {
  constructor({
    customer_id,
    full_name,
    phone,
    email,
    address,
    created_at,
    updated_at,
  }) {
    this.customer_id = customer_id;
    this.full_name = full_name;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // ➕ Add new customer
  static async create({ full_name, phone, email, address }) {
    try {
      const result = await pool.query(
        `
        INSERT INTO people.customers (full_name, phone, email, address)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [full_name, phone, email, address]
      );
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error creating customer:", error.message);
      throw error;
    }
  }

  // 🔍 Find customer by ID
  static async findById(customer_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM people.customers WHERE customer_id = $1`,
        [customer_id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error finding customer:", error.message);
      throw error;
    }
  }

  // 🔍 Find customer by phone or email
  static async findByContact(contact) {
    try {
      const result = await pool.query(
        `
        SELECT * FROM people.customers
        WHERE phone = $1 OR email = $1
        `,
        [contact]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error finding customer by contact:", error.message);
      throw error;
    }
  }

  // 📋 Get all customers
  static async findAll() {
    try {
      const result = await pool.query(
        `SELECT * FROM people.customers ORDER BY created_at DESC`
      );
      return result.rows;
    } catch (error) {
      console.error("❌ Error fetching customers:", error.message);
      throw error;
    }
  }

  // ✏️ Update customer details (any field)
  static async update(customer_id, fieldsToUpdate) {
    try {
      const keys = Object.keys(fieldsToUpdate);
      if (keys.length === 0) return null;

      const setClause = keys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");

      const values = Object.values(fieldsToUpdate);
      values.push(customer_id);

      const result = await pool.query(
        `
        UPDATE people.customers
        SET ${setClause}, updated_at = NOW()
        WHERE customer_id = $${values.length}
        RETURNING *
        `,
        values
      );

      return result.rows[0];
    } catch (error) {
      console.error("❌ Error updating customer:", error.message);
      throw error;
    }
  }

  // 🗑️ Delete customer
  static async delete(customer_id) {
    try {
      await pool.query(`DELETE FROM people.customers WHERE customer_id = $1`, [
        customer_id,
      ]);
      return true;
    } catch (error) {
      console.error("❌ Error deleting customer:", error.message);
      throw error;
    }
  }
}
