import express from "express";
import { verifySession } from "../util/sessions.js";
import { verifyRole } from "../util/validateRole.js";
import { uploadSingle } from "../config/multer.config.js";
import {
  createEquipment,
  deleteEquipment,
  download_equipment_csv,
  fetchEquipment,
} from "../controller/equipment.controller.js";
const equipmentRoute = express.Router();

equipmentRoute.post(
  "/add-equipment",
  verifySession,
  verifyRole,
  uploadSingle,
  createEquipment
);
equipmentRoute.get("/get-equipment", verifySession, fetchEquipment);
equipmentRoute.delete(
  "/delete/:equipment_id",
  verifySession,
  verifyRole,
  deleteEquipment
);
equipmentRoute.get(
  "/download-equipment-csv",
  verifySession,
  download_equipment_csv
);

export default equipmentRoute;
