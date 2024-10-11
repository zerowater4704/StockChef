"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticateToken_1 = require("../middlewares/authenticateToken/authenticateToken");
const owner_restaurant_controllers_1 = require("../controllers/owner-restaurant-controllers");
const router = (0, express_1.Router)();
// オーナーが従業員をレストランに参加させる
router.post("/employee", authenticateToken_1.authenticateToken, owner_restaurant_controllers_1.addEmployeeToRestaurant);
// 新しいレストラン追加
router.post("/newRestaurant", authenticateToken_1.authenticateToken, authenticateToken_1.authorizeAdminOrManger, owner_restaurant_controllers_1.addNewRestaurant);
// レストランに所属している従業員取得
router.get("/employees", authenticateToken_1.authenticateToken, owner_restaurant_controllers_1.getEmployeesByRestaurant);
// 特定のレストランの情報を取得
router.get("/:id", authenticateToken_1.authenticateToken, authenticateToken_1.authorizeAdminOrManger, owner_restaurant_controllers_1.getRestaurantById);
// オーナーのすべてのレストラン取得
router.get("/", authenticateToken_1.authenticateToken, owner_restaurant_controllers_1.getAllRestaurant);
// 特定のレストランの削除
router.delete("/:id", authenticateToken_1.authenticateToken, owner_restaurant_controllers_1.deleteRestaurant);
exports.default = router;
