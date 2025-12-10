import express from "express";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
} from "../controller/categories.controller.js";
import { verifySession } from "../util/sessions.js";
import { verifyRole } from "../util/validateRole.js";

export const categoryRoute = express.Router();
categoryRoute.post(
  "/create-category",
  verifySession,
  verifyRole,
  createCategory
);
categoryRoute.get(
  "/get-categories",
  verifySession,
  verifyRole,
  fetchCategories
);
categoryRoute.delete(
  "/delete-category/:category_id",
  verifySession,
  verifyRole,
  deleteCategory
);
export default categoryRoute;
