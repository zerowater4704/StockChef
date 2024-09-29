import { Router } from "express";
import { check } from "express-validator";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
} from "../controllers/category-controllers";
import {
  authenticateToken,
  authorizeAdminOrManger,
} from "../middlewares/authenticateToken/authenticateToken";

const router = Router();

router.post("/", authenticateToken, authorizeAdminOrManger, createCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
router.delete(
  "/:id",
  authenticateToken,
  authorizeAdminOrManger,
  deleteCategory
);

export default router;
