import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  name: string; // ✅ added
  email: string;
  password: string;
  role: "Main Contractor" | "Subcontractor" | "Default"; 
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Main Contractor", "Subcontractor", "Default"], 
      default: "Default",
    },
  },
  {
    timestamps: true,
  },
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
