import express from "express";
import { fetchStat } from "../controller/stat.controller.js";
const statRoute = express.Router();

statRoute.get("/get-stats", fetchStat);
export default statRoute;
