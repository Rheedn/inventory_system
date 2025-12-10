import { pool } from "../config/db.config.js";

export const connectPostgresDB = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Postgres Database connected successfully 🌐");
    client.release();
  } catch (error) {
    console.error("❌ Error connecting to Postgres database:", error.message);
  }
}