"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateToken_1 = require("../middlewares/authenticateToken/authenticateToken");
const user_restaurant_controllers_1 = require("../controllers/user-restaurant-controllers");
const router = (0, express_1.default)();
router.get("/userRestaurant", authenticateToken_1.authenticateToken, user_restaurant_controllers_1.getAllRestaurantByEmployee);
router.get("/:id", authenticateToken_1.authenticateToken, user_restaurant_controllers_1.getRestaurantById);
exports.default = router;
