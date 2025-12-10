import { pool } from "../config/db.config.js";
import { User } from "../model/User.js";
import bcryptjs from "bcryptjs";
import { clearSession, createSession } from "../util/sessions.js";
import { ActivityLog } from "../model/Activity_log.js";
import requestIP from "request-ip";
import { getClientIp } from "../util/getIpAddress.js";
export const registerUser = async (req, res) => {
  const { admin_id, name, email, department, password, role, phone_number } =
    req.body;
  // console.log({ admin_id, name, email, password, role });
  if (
    !admin_id ||
    !name ||
    !email ||
    !password ||
    !role ||
    !department ||
    !phone_number
  ) {
    return res.status(400).json({
      success: false,
      message: "Required field are empty",
    });
  }
  try {
    const isAdmin = await User.findUserById(admin_id);
    console.log(isAdmin);
    if (isAdmin.role !== "super_admin" && isAdmin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cant perform this action",
      });
    }
    // 1️⃣ Check if user already exists
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 2️⃣ Hash password
    const password_hash = await bcryptjs.hash(password, 10);

    // 3️⃣ Create new user instance
    const newUser = new User({
      name,
      email,
      password_hash,
      department,
      phone_number,
      role: role || "staff",
      status: "active",
    });

    // 4️⃣ Save user
    const savedUser = await newUser.save();
    const newActivity_log = new ActivityLog({
      user_id: isAdmin.user_id,
      user_name: isAdmin.name,
      user_email: isAdmin.email,
      user_role: isAdmin.role,
      action: "Create Account",
      details: `${isAdmin.name} created a new user account for ${name}`,
      ip_address: getClientIp(req),
      user_agent: req.headers["user-agent"],
      severity: "info",
      category: "User Management",
      affected_resource: savedUser.user_id,
      resource_type: "User",
    });
    await newActivity_log.create();


    // 5️⃣ Return response (without password)
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser,
    });
  } catch (error) {
    console.error("❌ Error creating user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const UserLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Required fields are empty",
    });
  }
  try {
    const userExist = await User.findUserByEmail(email);
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const passwordValid = await bcryptjs.compare(
      password,
      userExist.password_hash
    );
    if (!passwordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    createSession(res, {
      user_id: userExist.user_id,
      name: userExist.name,
      email: userExist.email,
    });

    const newActivity_log = new ActivityLog({
      user_id: userExist.user_id,
      user_name: userExist.name,
      user_email: userExist.email,
      user_role: userExist.role,
      action: "Account Login",
      details: `${userExist.name} logged into their account`,
      ip_address: getClientIp(req),
      user_agent: req.headers["user-agent"],
      severity: "info",
      category: "Authentication",
    });
    await newActivity_log.create();

    return res.status(200).json({
      success: true,
      message: "User logged in",
      user: userExist,
    });
  } catch (error) {
    console.log("Error while trying to login user: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const ChangeUserPassword = async (req, res) => {
  const { currentPassword, newPassword, user_id } = req.body;
  if (!currentPassword || !newPassword || !user_id) {
    return res.status(400).json({
      success: false,
      message: "Required fields are empty",
    });
  }
  try {
    const userExist = await User.findUserById(user_id);
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const userWithPassword = await pool.query(
      `SELECT * FROM auth.users WHERE user_id=$1`,
      [user_id]
    );
    const passwordIsValid = await bcryptjs.compare(
      currentPassword,
      userWithPassword.rows[0].password_hash
    );
    if (!passwordIsValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid current password",
      });
    }
    const password_hash = await bcryptjs.hash(newPassword, 10);
    const updated_user = await User.updateUser(userExist.user_id, { password_hash });
    const newActivity_log = new ActivityLog({
      user_id,
      user_name: userExist.name,
      user_email: userExist.email,
      user_role: userExist.role,
      action: "Change Password",
      details: `${userExist.name} successfully changed their password`,
      ip_address: getClientIp(req),
      user_agent: req.headers["user-agent"],
      severity: "moderate",
      category: "Security",
    });
    await newActivity_log.create();

    return res.status(200).json({
      success: true,
      message: "Your password has been updated successfully",
      user: updated_user,
    });
  } catch (error) {
    console.log("Error changing password: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const authenticatedUser = async (req, res) => {
  const userData = req.user;

  try {
    const user = await User.findUserById(userData.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Authenticated user",
      user,
    });
  } catch (error) {
    console.log("Error sending authenticating user: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const fetchAllUser = async (req, res) => {
  try {
    const users = await pool.query(
      `SELECT * FROM auth.users ORDER BY user_id DESC`
    );

    if (users.rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No users found",
        users: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: users.rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getUser = async (req, res) => {
  const { user_id } = req.params;
  console.log(user_id);
  try {
    const user = await User.findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User fetched",
      user,
    });
  } catch (error) {
    console.log("Error getting user: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const updateRole = async (req, res) => {
  const { user_id, role } = req.body;

  if (!user_id || !role) {
    return res.status(400).json({
      success: false,
      message: "User ID and role are required",
    });
  }

  try {
    // ✅ 1. Check if user exists
    const user = await User.findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ 2. If user is super_admin, ensure not the last one
    if (user.role === "super_admin") {
      const result = await pool.query(
        "SELECT COUNT(*) AS total FROM auth.users WHERE role = 'super_admin'"
      );

      const totalSuperAdmins = parseInt(result.rows[0].total, 10);

      if (totalSuperAdmins <= 1) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot change role. There must be at least one super admin remaining.",
        });
      }
    }

    // ✅ 3. Update the user's role
    const updatedUser = await pool.query(
      `UPDATE auth.users
       SET role = $1, updated_at = NOW()
       WHERE user_id = $2
       RETURNING *`,
      [role, user_id]
    );
    const newActivity_log = new ActivityLog({
      user_id: admin.user_id,
      user_name: admin.name,
      user_email: admin.email,
      user_role: admin.role,
      action: "Update User",
      details: `${admin.name} updated ${user.name || "a user"}'s account information`,
      ip_address: getClientIp(req),
      user_agent: req.headers["user-agent"],
      severity: "moderate",
      category: "User Management",
      affected_resource: user.user_id,
      resource_type: "User",
    });
    await newActivity_log.create();


    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser.rows[0],
    });
  } catch (error) {
    console.error("Error updating role:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating role",
    });
  }
};
export const logoutUser = async (req, res) => {
  await clearSession(req, res);
};
export const deleteUser = async (req, res) => {
  const { user_id } = req.body;


  if (!user_id) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    // ✅ 1. Check if user exists
    const user = await User.findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ 2. Prevent deleting the last super_admin
    if (user.role === "super_admin") {
      const result = await pool.query(
        "SELECT COUNT(*) AS total FROM auth.users WHERE role = 'super_admin'"
      );

      const totalSuperAdmins = parseInt(result.rows[0].total, 10);

      if (totalSuperAdmins <= 1) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot delete this user. There must be at least one super admin remaining.",
        });
      }
    }

    // ✅ 3. Delete user
    const deletedUser = await pool.query(
      `DELETE FROM auth.users WHERE user_id = $1 RETURNING *`,
      [user_id]
    );

    const activeUser = req.user;

    const newActivity_log = new ActivityLog({
      user_id: activeUser.user_id,
      user_name: activeUser.name,
      user_email: activeUser.email,
      user_role: activeUser.role,
      action: "Delete Account",
      details: `${activeUser.name} deleted user ${user.name} (${user.user_id})`,
      ip_address: getClientIp(req),
      user_agent: req.headers["user-agent"],
      severity: "high",
      category: "User Management",
      affected_resource: deletedUser.rows[0].user_id,
      resource_type: "User",
    });
    await newActivity_log.create();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: deletedUser.rows[0],
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting user",
    });
  }
};

export const update_user = async (req, res) => {
  const {
    admin_id,
    user_id,
    name,
    email,
    phone_number,
    role,
    status,
    department,
  } = req.body;

  // ✅ 1. Validate required fields
  if (!admin_id || !user_id) {
    return res.status(400).json({
      success: false,
      message: "Admin ID and User ID are required",
    });
  }

  // ✅ 2. Ensure at least one field is provided for update
  if (!name && !email && !phone_number && !role && !status && !department) {
    return res.status(400).json({
      success: false,
      message: "You must update at least one field",
    });
  }

  try {
    // ✅ 3. Verify that admin exists and has privilege
    const admin = await User.findUserById(admin_id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (admin.role !== "super_admin" && admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't have permission to perform this action",
      });
    }

    // ✅ 4. Check if user exists
    const user = await User.findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ 5. Prevent admins from updating super_admins
    if (user.role === "super_admin" && admin.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot modify a super admin account",
      });
    }

    // ✅ 6. Prevent demoting the last super_admin
    if (user.role === "super_admin" && role && role !== "super_admin") {
      const result = await pool.query(
        `SELECT COUNT(*) AS total FROM auth.users WHERE role = 'super_admin'`
      );
      const totalSuperAdmins = parseInt(result.rows[0].total, 10);
      if (totalSuperAdmins <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot demote the last remaining super admin.",
        });
      }
    }

    // ✅ 7. Build dynamic fields to update
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    if (phone_number) fieldsToUpdate.phone_number = phone_number;
    if (role) fieldsToUpdate.role = role;
    if (status) fieldsToUpdate.status = status;
    if (department) fieldsToUpdate.department = department;

    // ✅ 8. Perform the update
    const updated_user = await User.updateUser(user_id, fieldsToUpdate);

    if (!updated_user) {
      return res.status(400).json({
        success: false,
        message: "Failed to update user",
      });
    }

    // ✅ 9. Log activity
    const clientIp = requestIP.getClientIp(req);
    await pool.query(
      `INSERT INTO operation.activity_logs (user_id, action, details, ip_address, severity)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        admin_id,
        "Update User",
        `Updated ${user.name || "a user"}'s information.`,
        clientIp,
        "moderate",
      ]
    );

    // ✅ 10. Return success
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updated_user,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating user",
    });
  }
};
