import express from "express";
import cors from "cors";
import connectDB from "./db";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user";
import categoryRoutes from "./routes/categories";
import itemRouter from "./routes/Items";
import ownerRouter from "./routes/owner";
import userShiftRouter from "./routes/user-shift";
import ownerShiftRouter from "./routes/owner-shift";
import ownerRestaurantRouter from "./routes/owner-restaurant";
import userRestaurantRouter from "./routes/user-restaurant";

const app = express();
const PORT = 3000;
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173", // 開発環境のフロントエンドURL
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/owner", ownerRouter);
app.use("/api/owner/restaurant", ownerRestaurantRouter);
app.use("/api/owner/shift", ownerShiftRouter);
app.use("/api/category", categoryRoutes);
app.use("/api/item", itemRouter);
app.use("/api/user", userRoutes);
app.use("/api/user/shift", userShiftRouter);
app.use("/api/user/restaurant", userRestaurantRouter);

app.listen(PORT, () => {
  console.log("サーバーが起動しました");
});
