import Transaction from "../models/Transaction.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";

export const requestWithdrawService = async (userId, amount) => {
  const session = await mongoose.startSession();

  try {
    if (amount <= 0) {
      const err = new Error("Invalid withdrawal amount");
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findById(userId);

    if (!user || user.walletBalance < amount) {
      const err = new Error("Insufficient wallet balance");
      err.statusCode = 400;
      throw err;
    }

    session.startTransaction();

    user.walletBalance -= amount;
    user.totalWithdrawAmount += amount;
    await user.save({ session });

    await Transaction.create(
      [
        {
          user: user._id,
          type: "WITHDRAW",
          amount,
          status: "PENDING",
          notes: "Withdrawal request",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return true;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    session.endSession();
    throw error;
  }
};

export const getMyTransactionsService = async (userId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  const safePage = page < 1 ? 1 : page;
  const safeLimit = limit < 1 ? 10 : limit;

  const skip = (safePage - 1) * safeLimit;

  const transactions = await Transaction.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit)
    .select("type amount status notes tournament createdAt")
    .populate("tournament", "title map");

  const total = await Transaction.countDocuments({ user: userId });

  return {
    page: safePage,
    limit: safeLimit,
    total,
    totalPages: Math.ceil(total / safeLimit),
    transactions,
  };
};
