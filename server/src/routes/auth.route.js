import express from "express";
import {
  authenticatedUser,
  ChangeUserPassword,
  deleteUser,
  fetchAllUser,
  getUser,
  logoutUser,
  registerUser,
  update_user,
  updateRole,
  UserLogin,
} from "../controller/auth.controller.js";
import { verifySession } from "../util/sessions.js";
import { verifyRole, verifySuperRole } from "../util/validateRole.js";

export const authRoutes = express.Router();
authRoutes.post("/register-user", registerUser);
authRoutes.post("/user-login", UserLogin);
authRoutes.post("/change-password", ChangeUserPassword);
authRoutes.get("/get-authenticated-user", verifySession, authenticatedUser);
authRoutes.post("/logout", verifySession, logoutUser);
authRoutes.get("/users/get-all-users", verifySession, verifyRole, fetchAllUser);
authRoutes.get("/user/get-user/:user_id", verifySession, verifyRole, getUser);
authRoutes.post(
  "/users/change-role",
  verifySession,
  verifySuperRole,
  updateRole
);
authRoutes.post(
  "/users/delete-user/",
  verifySession,
  verifySuperRole,
  deleteUser
);
authRoutes.post("/users/update-user", verifySession, verifyRole, update_user);
