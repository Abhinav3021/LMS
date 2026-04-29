import mongoose, { Schema, Document } from "mongoose";
import { Role } from "../../types/roles";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.BORROWER,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);