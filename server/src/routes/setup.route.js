import express from "express";
import {
  checkSuperAdmin,
  createSuperAdmin,
  verifySecretKey,
} from "../controller/setup.controller.js";

export const setUpRoute = express.Router();
setUpRoute.get("/check-super-admin", checkSuperAdmin);
setUpRoute.post("/create-super-admin", createSuperAdmin);
setUpRoute.post("/verify-secrete-key",verifySecretKey)
