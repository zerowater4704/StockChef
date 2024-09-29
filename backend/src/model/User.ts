import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "employee";
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 6 },
  role: {
    type: String,
    enum: ["admin", "manager", "employee"],
    default: "employee",
  },
});

export default mongoose.model<IUser>("User", userSchema);
