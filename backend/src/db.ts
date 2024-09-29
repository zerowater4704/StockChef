import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error("MongoDB 接続に失敗", error);
  }
};

export default connectDB;
