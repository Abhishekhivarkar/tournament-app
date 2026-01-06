import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
      enum: ["ADMIN"],
      default: "ADMIN"
    },

    isActive: {
      type: Boolean,
      default: true
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordToken:{
        type:Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
