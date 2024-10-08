import { Router } from "express";
import {
  authenticateToken,
  authorizeAdminOrManger,
} from "../middlewares/authenticateToken/authenticateToken";
import { requestShifts } from "../controllers/shift-controllers";

const router = Router();

router.post("/requestShifts", authenticateToken, requestShifts);

export default router;
