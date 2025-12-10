import { pool } from "../config/db.config.js";
import { Category } from "../model/Category.js"; // ensure this model is correctly defined

// ✅ CREATE CATEGORY
export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: "Required fields are empty",
    });
  }

  try {
    // Create new category using Sequelize model
    const newCategory = await Category.create({ name, description });

    // Fetch updated category list
    const { rows: categories } = await pool.query(
      `SELECT * FROM inventory.category ORDER BY category_id DESC`
    );

    return res.status(201).json({
      success: true,
      data: newCategory,
      categories,
      message: "Category added successfully",
    });
  } catch (error) {
    console.error("Error creating category:", error);
    if (
      error.code === "23505" ||
      error.message.includes("duplicate key value")
    ) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating category",
    });
  }
};

// ✅ FETCH ALL CATEGORIES
export const fetchCategories = async (req, res) => {
  try {
    const { rows: categories } = await pool.query(
      `SELECT * FROM inventory.category ORDER BY category_id DESC`
    );
    return res.status(200).json({
      success: true,
      categories,
      message: "Categories fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching categories",
    });
  }
};

// ✅ DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  const { category_id } = req.params;
  if (!category_id) {
    return res.status(400).json({
      success: false,
      message: "Category ID is required",
    });
  }

  try {
    const result = await pool.query(
      `DELETE FROM inventory.category WHERE category_id = $1 RETURNING *`,
      [category_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const { rows: categories } = await pool.query(
      `SELECT * FROM inventory.category ORDER BY category_id DESC`
    );

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      categories,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting category",
    });
  }
};
