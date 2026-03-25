import {
  userRegisterService,
  adminRegisterService,
  loginService,
  logoutService,
  forgotPasswordService,
  resetPasswordService
} from "../services/auth.service.js";

export const userRegister = async (req, res) => {
  try {
    const result = await userRegisterService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (error) {
    console.error("USER REGISTER ERROR:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to register user"
    });
  }
};

export const adminRegister = async (req, res) => {
  try {
    const result = await adminRegisterService(req.body);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: result
    });
  } catch (error) {
    console.error("ADMIN REGISTER ERROR:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to register admin"
    });
  }
};

export const login = async (req, res) => {
  try {
    const { token, role } = await loginService(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      role,
      token
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Login failed"
    });
  }
};

export const logout = (req, res) => {
  try {
    logoutService();

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict"
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body);

    res.json(result);
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const result = await resetPasswordService({
      token: req.params.token,
      ...req.body
    });

    res.json(result);
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to reset password"
    });
  }
};