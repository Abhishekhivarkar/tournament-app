import Transaction from "../models/Transaction.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";

export const requestWithdraw = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const userId = req.user._id;
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid withdrawal amount"
      });
    }

    const user = await User.findById(userId);

    if (!user || user.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance"
      });
    }

    session.startTransaction();

    // Wallet deduct
    user.walletBalance -= amount;
    user.totalWithdrawAmount += amount;
    await user.save({ session });

    // Create transaction
    await Transaction.create(
      [{
        user: user._id,
        type: "WITHDRAW",
        amount,
        status: "PENDING",
        notes: "Withdrawal request"
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Withdrawal request submitted"
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const getMyTransactions = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // fetch transactions
    const transactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("type amount status notes tournament createdAt")
      .populate("tournament", "title map");

    // total count
    const total = await Transaction.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      page,
      limit,
      totalTransactions: total,
      totalPages: Math.ceil(total / limit),
      data: transactions
    });
  } catch (error) {
    console.error("GET MY TRANSACTIONS ERROR:", error);
    next(error);
  }
};