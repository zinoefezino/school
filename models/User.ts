import { Schema, models, model, Document } from "mongoose";

export type UserRole = "ADMIN" | "STAFF" | "PARENT" | "STUDENT";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["ADMIN", "STAFF", "PARENT", "STUDENT"],
    required: true,
  },
  isActive: { type: Boolean, default: true },
  mustChangePassword: { type: Boolean, default: true },
  lastLoginAt: Date,
});

export default models.User || model<IUser>("User", userSchema);
