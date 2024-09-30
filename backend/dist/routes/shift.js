"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticateToken_1 = require("../middlewares/authenticateToken/authenticateToken");
const router = (0, express_1.Router)();
router.post("/", authenticateToken_1.authenticateToken);
exports.default = router;
