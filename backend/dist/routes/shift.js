"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticateToken_1 = require("../middlewares/authenticateToken/authenticateToken");
const shift_controllers_1 = require("../controllers/shift-controllers");
const router = (0, express_1.Router)();
router.post("/requestShifts", authenticateToken_1.authenticateToken, shift_controllers_1.requestShifts);
exports.default = router;
