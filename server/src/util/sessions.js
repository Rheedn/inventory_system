import jwt from "jsonwebtoken";

export const createSession = (res, userData) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT secret key not provided");
  }

  const session_name = "algoy_inventory_Session";

  const token = jwt.sign({ userData }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  res.cookie(session_name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

export const verifySession = (req, res, next) => {
  try {
    const token = req.cookies.algoy_inventory_Session;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.userData; // attach user data to request

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export const clearSession = (req, res) => {
  const session_name = "algoy_inventory_Session";

  try {
    res.clearCookie(session_name, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while logging out",
    });
  }
};
