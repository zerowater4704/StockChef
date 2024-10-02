import { Router } from "express";
import {
  authenticateToken,
  authorizeAdminOrManger,
} from "../middlewares/authenticateToken/authenticateToken";
import {
  confirmShift,
  deleteShift,
  getShifts,
  requestShift,
  updateShift,
} from "../controllers/shift-controllers";

const router = Router();

router.post("/requestShift", authenticateToken, requestShift);

router.get("/getShifts", authenticateToken, getShifts);

router.put("/updateShift", authenticateToken, updateShift);

router.delete("/deleteShift", authenticateToken, deleteShift);

router.post(
  "/confirmShift",
  authenticateToken,
  authorizeAdminOrManger,
  confirmShift
);

export default router;
