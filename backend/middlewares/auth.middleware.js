import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Admin from "../models/Admin.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
   
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id || !decoded?.role) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    let account;
    if (decoded.role === "admin") {
      account = await Admin.findById(decoded.id).select("-password");
    } else {
      account = await User.findById(decoded.id).select("-password");
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "account not found"
      });
    }


if (decoded.role === "admin" && !account.isActive) {
  return res.status(403).json({
    success: false,
    message: "Admin account disabled"
  });
}


if (decoded.role === "user" && account.isBanned) {
  return res.status(403).json({
    success: false,
    message: "User account banned"
  });
}


    req.user = account;
    req.user.role = decoded.role;

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Authentication failed"
    });
  }
};