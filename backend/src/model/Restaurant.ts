import mongoose, { Schema, Document } from "mongoose";

interface IRestaurant extends Document {
  name: string;
  location: string;
  adminId: mongoose.Schema.Types.ObjectId;
}

const restaurantSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRestaurant>("Restaurant", restaurantSchema);
