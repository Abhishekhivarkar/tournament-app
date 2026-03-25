import User from "../models/User.model.js";
import Admin from "../models/Admin.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendResetPasswordMail } from "./mail.service.js";

export const userRegisterService = async ({
  name,
  email,
  phoneNumber,
  bgmiGameId,
  password
}) => {

  const existingUser = await User.findOne({ email });
  const existingAdmin = await Admin.findOne({ email });

  if (existingUser || existingAdmin) {
    const err = new Error("Email already registered");
    err.statusCode = 409;
    throw err;
  }

  const hashPwd = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phoneNumber,
    bgmiGameId,
    password: hashPwd
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    bgmiGameId: user.bgmiGameId
  };
};

export const adminRegisterService = async ({
  name,
  email,
  phoneNumber,
  password,
  secretKey
}) => {


  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    const err = new Error("Invalid admin secret key");
    err.statusCode = 403;
    throw err;
  }

  const existingAdmin = await Admin.findOne({ email });
  const existingUser = await User.findOne({ email });

  if (existingAdmin || existingUser) {
    const err = new Error("Email already registered");
    err.statusCode = 409;
    throw err;
  }

  const hashPwd = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    name,
    email,
    phoneNumber,
    password: hashPwd
  });

  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    phoneNumber: admin.phoneNumber
  };
};

export const loginService = async ({ email, password }) => {

  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.statusCode = 400;
    throw err;
  }

  let account = await User.findOne({ email }).select("+password");
  let role = "user";

  if (!account) {
    account = await Admin.findOne({ email }).select("+password");
    role = "admin";
  }

  if (!account) {
    const err = new Error("Account not found");
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, account.password);

  if (!isMatch) {
    const err = new Error("Incorrect password");
    err.statusCode = 401;
    throw err;
  }

  if (role === "user" && account.isBanned) {
    const err = new Error("Your account is banned");
    err.statusCode = 403;
    throw err;
  }

  if (role === "admin" && !account.isActive) {
    const err = new Error("Admin account disabled");
    err.statusCode = 403;
    throw err;
  }

  const token = jwt.sign(
    {
      id: account._id,
      role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, role };
};

export const logoutService = () => {
  return true;
};

export const forgotPasswordService = async ({ email }) => {

  let account =
    (await User.findOne({ email })) ||
    (await Admin.findOne({ email }));

  if (!account) {
    return {
      success: true,
      message: "If email exists, reset link sent"
    };
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

  return {
    success: true,
    message: "Reset password link sent to email"
  };
};

export const resetPasswordService = async ({
  token,
  newPassword,
  confirmPassword
}) => {

  if (!newPassword || !confirmPassword) {
    const err = new Error("Both passwords required");
    err.statusCode = 400;
    throw err;
  }

  if (newPassword !== confirmPassword) {
    const err = new Error("Passwords do not match");
    err.statusCode = 400;
    throw err;
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
    const err = new Error("Invalid or expired token");
    err.statusCode = 400;
    throw err;
  }

  account.password = await bcrypt.hash(newPassword, 10);
  account.resetPasswordToken = undefined;
  account.resetPasswordExpire = undefined;

  await account.save();

  return {
    success: true,
    message: "Password reset successful"
  };
};