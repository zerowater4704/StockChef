import { Router } from "express";
import {
  authenticateToken,
  authorizeAdminOrManger,
} from "../middlewares/authenticateToken/authenticateToken";
import {
  confirmShiftsByRestaurant,
  deleteShift,
  getAllConfirmedShift,
  getAllPendingShift,
  updatePendingShift,
} from "../controllers/owner-shift-controllers";

const router = Router();

router.get(
  "/pendingShift",
  authenticateToken,
  authorizeAdminOrManger,
  getAllPendingShift
);

router.post(
  "/confirmShift",
  authenticateToken,
  authorizeAdminOrManger,
  confirmShiftsByRestaurant
);

router.put(
  "/updateShift",
  authenticateToken,
  authorizeAdminOrManger,
  updatePendingShift
);

router.get(
  "/confirmedShift",
  authenticateToken,
  authorizeAdminOrManger,
  getAllConfirmedShift
);

router.delete(
  "/deleteShift",
  authenticateToken,
  authorizeAdminOrManger,
  deleteShift
);
export default router;
