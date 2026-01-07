import mongoose from "mongoose";
import {ROLE,ROLE_ARRAY} from "../config/role.js"
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

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ROLE_ARRAY,
      default: ROLE.ADMIN
    },

    isActive: {
      type: Boolean,
      default: true
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

export default mongoose.model("Admin", adminSchema);
