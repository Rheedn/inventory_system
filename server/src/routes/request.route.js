import express from "express";
import { verifySession } from "../util/sessions.js";
import { verifyRole, verifyStaff } from "../util/validateRole.js";
import {
  createRequest,
  download_request_csv,
  fetchAllRequest,
  updateRequestStatus,
} from "../controller/request.controller.js";
const requestRoute = express.Router();

requestRoute.post("/create-request", verifySession, verifyStaff, createRequest);
requestRoute.get("/fetch-all-requests", verifySession, fetchAllRequest);
requestRoute.post(
  "/update-request-status",
  verifySession,
  verifyRole,
  updateRequestStatus
);

requestRoute.get("/download-csv", verifySession, download_request_csv);
export default requestRoute;