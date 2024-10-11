import Router from "express";
import { authenticateToken } from "../middlewares/authenticateToken/authenticateToken";
import {
  getAllRestaurantByEmployee,
  getRestaurantById,
} from "../controllers/user-restaurant-controllers";

const router = Router();

router.get("/userRestaurant", authenticateToken, getAllRestaurantByEmployee);
router.get("/:id", authenticateToken, getRestaurantById);

export default router;
