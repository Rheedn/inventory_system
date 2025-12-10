import express from "express";
import { verifySession } from "../util/sessions.js";
import { verifyRole } from "../util/validateRole.js";
import { fetchLogs, getLog } from "../controller/logs.controller.js";
const logRoutes = express.Router();
logRoutes.get("/fetch-logs", verifySession, verifyRole, fetchLogs);
logRoutes.get("/get-log/:log_id", verifySession, verifyRole, getLog)
export default logRoutes;
