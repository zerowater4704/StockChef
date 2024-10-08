import mongoose, { Schema, Document } from "mongoose";

interface IShift extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  year: number;
  month: number;
  shifts: {
    data: string;
    startTime: string;
    finishTime: string;
    confirmed: string;
  }[];
}

const shiftSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    shifts: [
      {
        date: { type: String, required: true },
        startTime: { type: String, required: true },
        finishTime: { type: String, required: true },
        confirmed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IShift>("Shift", shiftSchema);
