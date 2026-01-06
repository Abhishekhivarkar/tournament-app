import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true
    },

    bgmiGameId: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["USER"],
      default: "USER"
    },

    isBanned: {
      type: Boolean,
      default: false
    },

    walletBalance: {
      type: Number,
      default: 0
    },

    totalMatches: {
      type: Number,
      default: 0
    },

    totalWins: {
      type: Number,
      default: 0
    },

    totalWinAmount: {
      type: Number,
      default: 0
    },

    totalWithdrawAmount: {
      type: Number,
      default: 0
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
