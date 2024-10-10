import express from "express";
import cors from "cors";
import connectDB from "./db";
import userRoutes from "./routes/user";
import categoryRoutes from "./routes/categories";
import itemRouter from "./routes/Items";
import ownerRouter from "./routes/owner";
import userShiftRouter from "./routes/user-shift";
import ownerShiftRouter from "./routes/owner-shift";
import restaurantRouter from "./routes/restaurant";

const app = express();
const PORT = 3000;
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/owner", ownerRouter);
app.use("/api/user", userRoutes);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/category", categoryRoutes);
app.use("/api/item", itemRouter);
app.use("/api/user/shift", userShiftRouter);
app.use("/api/owner/shift", ownerShiftRouter);

app.listen(PORT, () => {
  console.log("サーバーが起動しました");
});
