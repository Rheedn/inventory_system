import { User } from "../model/User.js";

export const verifyRole = async (req, res, next) => {
  const allowedRoles = ["super_admin", "admin"];

  try {
    const { user_id } = req.user;
    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — missing user ID",
      });
    }
    const user = await User.findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // console.log(allowedRoles.includes(user.role));
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied — insufficient permissions",
      });
    }
    if (user.status == "suspended" || user.status == "banned") {
      return res.status(403).json({
        success: false,
        message: "Sorry you cant perform this action",
      });
    }
    // ✅ Passed — user has the right role
    next();
  } catch (error) {
    console.error("Error verifying role:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const verifySuperRole = async (req, res, next) => {
  const allowedRoles = ["super_admin"];

  try {
    const { user_id } = req.user;
    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — missing user ID",
      });
    }
    const user = await User.findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // console.log(allowedRoles.includes(user.role));
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied — insufficient permissions",
      });
    }
    // ✅ Passed — user has the right role
    next();
  } catch (error) {
    console.error("Error verifying role:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const verifyStaff = async (req, res, next) => {
  const allowedRoles = ["staff"];

  try {
    const { user_id } = req.user;
    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — missing user ID",
      });
    }
    const user = await User.findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // console.log(allowedRoles.includes(user.role));
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied — insufficient permissions",
      });
    }
    // ✅ Passed — user has the right role
    next();
  } catch (error) {
    console.error("Error verifying role:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
