import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "employee";
  restaurantId?: mongoose.Schema.Types.ObjectId[];
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 6 },
    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },
    restaurantId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
