import mongoose, { Schema, Document } from "mongoose";

interface IItem extends Document {
  name: string;
  stock: number;
}

const itemSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IItem>("Item", itemSchema);
