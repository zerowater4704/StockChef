import { Router } from "express";
import {
  authenticateToken,
  authorizeAdminOrManger,
} from "../middlewares/authenticateToken/authenticateToken";
import {
  deleteShift,
  getConfirmedShifts,
  getPendingShifts,
  requestShifts,
  updateShift,
} from "../controllers/user-shift-controllers";

const router = Router();

router.post("/requestShifts", authenticateToken, requestShifts);
router.get("/pending", authenticateToken, getPendingShifts);
router.get("/confirmed", authenticateToken, getConfirmedShifts);

router.put("/updateShift", authenticateToken, updateShift);

router.delete("/deleteShift", authenticateToken, deleteShift);

export default router;
