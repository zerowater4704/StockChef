import mongoose, { Schema, Document } from "mongoose";

interface IShift extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  shiftDate: string;
  shiftTime: string;
  confirmedShift: String;
}

const shiftSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shiftDate: { type: String, required: true },
    shiftTime: { type: String, required: true },
    confirmedShift: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IShift>("Shift", shiftSchema);
