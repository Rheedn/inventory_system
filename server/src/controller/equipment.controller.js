import { Equipment } from "../model/Equipments.js";
import cloudinary from "../config/cloudinary.config.js";
import { generateQRcode } from "../util/generateQRCode.js";
import fs from "fs";
import { pool } from "../config/db.config.js";
import { createObjectCsvStringifier } from "csv-writer";
export const createEquipment = async (req, res) => {
  const { name, description, quantity, condition, category_id, status } =
    req.body;

  if (!name || !description || !quantity || !condition || !category_id) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Ensure file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "EquiShare/equipment",
      public_id: `eqp-${Date.now()}`,
      resource_type: "image",
    });

    // ✅ Clean up local file after upload
    fs.unlink(req.file.path, (err) => {
      if (err) console.warn("Failed to delete local upload:", err.message);
    });

    // Generate unique QR code
    const qr_code = generateQRcode();

    // Create and save new equipment
    const newEquipment = new Equipment({
      name,
      description,
      qr_code,
      quantity,
      condition,
      category_id,
      equipment_image: uploadResult.secure_url,
      status: status || "available",
    });

    const savedEquipment = await newEquipment.save();

    res.status(201).json({
      success: true,
      message: "Equipment added successfully",
      equipment: savedEquipment,
    });
  } catch (error) {
    console.error("Error creating equipment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating equipment",
      error: error.message,
    });
  }
};
export const fetchEquipment = async (req, res) => {
  console.log(req.query);
  const limit = parseInt(req.query.limit) || 10; // Default 10
  const offset = parseInt(req.query.offset) || 0; // Default 0

  try {
    const result = await pool.query(
      `
      SELECT
        e.equipment_id,
        e.name AS equipment_name,
        e.quantity,
        e.qr_code,
        e.condition,
        e.status,
        e.created_at,
        e.updated_at,
        c.name AS category_name,
        c.description AS category_description
      FROM inventory.equipment e
      JOIN inventory.category c ON c.category_id = e.category_id
      ORDER BY e.equipment_id DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM inventory.equipment`
    );

    res.status(200).json({
      success: true,
      message: "Equipment fetched successfully",
      equipment: result.rows,
      pagination: {
        limit,
        offset,
        count: parseInt(totalResult.rows[0].count, 10),
      },
    });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch equipment",
    });
  }
};
export const deleteEquipment = async (req, res) => {
  const { equipment_id } = req.params;

  try {
    // Attempt to delete equipment
    const result = await pool.query(
      `DELETE FROM inventory.equipment WHERE equipment_id = $1 RETURNING *`,
      [equipment_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Equipment deleted successfully",
      deleted: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting equipment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete equipment",
    });
  }
};
export const getEquipment = async (req, res) => {
  const { equipment_id } = req.params;
  try {
    const equipment = await Equipment.findById(equipment_id);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Equipment fetched",
      equipment,
    });
  } catch (error) {
    console.log("Error getting equipment: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const download_equipment_csv = async (req, res) => {
  try {
    // 1️⃣ Fetch data
    const requestQuery = `SELECT * FROM inventory.equipment`;

    const { rows } = await pool.query(requestQuery);

    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "No requests found" });
    }

    // 2️⃣ Create CSV writer (in-memory)
    const csvStringifier = createObjectCsvStringifier({
      header: Object.keys(rows[0]).map((key) => ({
        id: key,
        title: key.toUpperCase(),
      })),
    });

    // 3️⃣ Build CSV string
    const headerString = csvStringifier.getHeaderString();
    const recordsString = csvStringifier.stringifyRecords(rows);
    const csvData = headerString + recordsString;

    // 4️⃣ Set headers for download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=equipment.csv");

    // 5️⃣ Send CSV
    res.send(csvData);
  } catch (error) {
    console.error("Error generating CSV:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
