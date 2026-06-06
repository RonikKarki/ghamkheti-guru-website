import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "super_admin" | "admin" | "editor";

export interface IUser extends Document {
  name:           string;
  email:          string;
  password?:      string;
  role:           UserRole;
  image?:         string;
  emailVerified?: Date;
  isActive:       boolean;
  lastLoginAt?:   Date;
  loginCount:     number;
  createdAt:      Date;
  updatedAt:      Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:  { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    password:      { type: String, select: false },
    role:          { type: String, enum: ["super_admin", "admin", "editor"], default: "editor" },
    image:         { type: String },
    emailVerified: { type: Date },
    isActive:      { type: Boolean, default: true, index: true },
    lastLoginAt:   { type: Date },
    loginCount:    { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1, isActive: 1 });

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
