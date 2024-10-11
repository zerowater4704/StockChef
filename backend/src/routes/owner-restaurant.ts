import { Router } from "express";
import {
  authenticateToken,
  authorizeAdminOrManger,
} from "../middlewares/authenticateToken/authenticateToken";
import {
  addEmployeeToRestaurant,
  addNewRestaurant,
  getAllRestaurant,
  getEmployeesByRestaurant,
  getRestaurantById,
  deleteRestaurant,
} from "../controllers/owner-restaurant-controllers";

const router = Router();

// オーナーが従業員をレストランに参加させる
router.post("/employee", authenticateToken, addEmployeeToRestaurant);

// 新しいレストラン追加
router.post(
  "/newRestaurant",
  authenticateToken,
  authorizeAdminOrManger,
  addNewRestaurant
);

// レストランに所属している従業員取得
router.get("/employees", authenticateToken, getEmployeesByRestaurant);

// 特定のレストランの情報を取得
router.get(
  "/:id",
  authenticateToken,
  authorizeAdminOrManger,
  getRestaurantById
);

// オーナーのすべてのレストラン取得
router.get("/", authenticateToken, getAllRestaurant);

// 特定のレストランの削除
router.delete("/:id", authenticateToken, deleteRestaurant);

export default router;
