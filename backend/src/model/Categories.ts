import mongoose, { Schema, Document } from "mongoose";

interface ICategories extends Document {
  name: string;
  items: mongoose.Schema.Types.ObjectId[];
}

const categoriesSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ICategories>("Categories", categoriesSchema);
