import { Router } from "express";
import {
  authenticateToken,
  authorizeAdminOrManger,
} from "../middlewares/authenticateToken/authenticateToken";
import {
  addItemToCategory,
  deleteItem,
  getItem,
  updateItem,
} from "../controllers/Item-controllers";

const router = Router();

router.post(
  "/:id/item",
  authenticateToken,
  authorizeAdminOrManger,
  addItemToCategory
);

router.get("/:id", authenticateToken, authorizeAdminOrManger, getItem);
router.put("/:id", authenticateToken, authorizeAdminOrManger, updateItem);
router.delete("/:id", authenticateToken, authorizeAdminOrManger, deleteItem);
export default router;
