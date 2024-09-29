import express from "express";
import cors from "cors";
import connectDB from "./db";
import userRoutes from "./routes/user";
import categoryRoutes from "./routes/categories";

const app = express();
const PORT = 3000;
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);

app.listen(PORT, () => {
  console.log("サーバーが起動しました");
});
