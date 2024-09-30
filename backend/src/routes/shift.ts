import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken/authenticateToken";

const router = Router();

router.post("/", authenticateToken);

export default router;
