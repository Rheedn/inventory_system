import express from "express";
import { checkout } from "../controller/transaction.controller.js";
import { verifySession } from "../util/sessions.js";

const router = express.Router();

router.post("/checkout", verifySession, checkout);

export default router;
