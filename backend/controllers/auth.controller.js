import User from "../models/User.model.js"
import Admin from "../models/Admin.model.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import {sendResetPasswordMail} from "../service/mail.service.js"
export const userRegister = async (req, res) => {
  try {
    const { name, email, phoneNumber, bgmiGameId, password } = req.body;

    if (!name || !email || !phoneNumber || !bgmiGameId || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });

    if (existingUser || existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashPwd = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phoneNumber,
      bgmiGameId,
      password: hashPwd
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        bgmiGameId: user.bgmiGameId
      }
    });
  } catch (error) {
    console.error("USER REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user"
    });
  }
};

export const adminRegister = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, secretKey } = req.body;

    if (!name || !email || !phoneNumber || !password || !secretKey) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin secret key"
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    const existingUser = await User.findOne({ email });

    if (existingAdmin || existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashPwd = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      phoneNumber,
      password: hashPwd
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phoneNumber: admin.phoneNumber
      }
    });
  } catch (error) {
    console.error("ADMIN REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register admin"
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    let account = await User.findOne({ email }).select("+password")
    let role = "user";

    if (!account) {
      account = await Admin.findOne({ email }).select("+password");
      role = "admin";
    }

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }
if (role === "user" && account.isBanned) {
  return res.status(403).json({
    success: false,
    message: "Your account is banned"
  });
}

if (role === "admin" && !account.isActive) {
  return res.status(403).json({
    success: false,
    message: "Admin account disabled"
  });
}
    const token = jwt.sign(
      {
        id: account._id,
        role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

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
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict"
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    let account =
      (await User.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (!account) {
      return res.json({
        success: true,
        message: "If email exists, reset link sent"
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");


    account.resetPasswordToken = hashedToken;
    account.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await account.save({ validateBeforeSave: false });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendResetPasswordMail({
      userEmail: account.email,
      userName: account.name,
      resetLink
    });

    return res.json({
      success: true,
      message: "Reset password link sent to email"
    });

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
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Both passwords required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

  
    let account =
      (await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      }).select("+password")) ||
      (await Admin.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      }).select("+password"));

    if (!account) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    account.password = await bcrypt.hash(newPassword, 10);
    account.resetPasswordToken = undefined;
    account.resetPasswordExpire = undefined;

    await account.save();

    res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password"
    });
  }
};