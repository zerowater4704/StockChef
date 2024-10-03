"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const owner_controller_1 = require("../controllers/owner-controller");
const express_validator_1 = require("express-validator");
const authenticateToken_1 = require("../middlewares/authenticateToken/authenticateToken");
const router = (0, express_1.Router)();
router.post("/signup", [
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("有効なメールアドレスを入力してください"),
    (0, express_validator_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("パスワードは6文字以上で入力してください"),
    (0, express_validator_1.check)("name").notEmpty().withMessage("名前を入力してください"),
    (0, express_validator_1.check)("restaurantName")
        .notEmpty()
        .withMessage("レストラン名を入力してください"),
], owner_controller_1.registerOwner);
router.post("/login", [
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("有効なメールアドレスを入力してください"),
    (0, express_validator_1.check)("password").notEmpty().withMessage("パスワードが間違っています"),
], owner_controller_1.ownerLogin);
router.get("/joiningKey", authenticateToken_1.authenticateToken, authenticateToken_1.authorizeAdminOrManger, owner_controller_1.getJoiningKey);
router.post("/addNewRestaurant", authenticateToken_1.authenticateToken, authenticateToken_1.authorizeAdminOrManger, owner_controller_1.addNewRestaurant);
router.put("/updateOwner", authenticateToken_1.authenticateToken, authenticateToken_1.authorizeAdminOrManger, owner_controller_1.updateOwner);
router.put("/updateRestaurant", authenticateToken_1.authenticateToken, authenticateToken_1.authorizeAdminOrManger, owner_controller_1.updateRestaurant);
router.get("/employee", authenticateToken_1.authenticateToken, authenticateToken_1.authorizeAdminOrManger, owner_controller_1.getEmployeesByRestaurant);
router.get("/restaurant/:id", authenticateToken_1.authenticateToken, authenticateToken_1.authorizeAdminOrManger, owner_controller_1.getRestaurantById);
router.get("/restaurant", authenticateToken_1.authenticateToken, authenticateToken_1.authorizeAdminOrManger, owner_controller_1.getRestaurant);
router.delete("/deleteRestaurant", authenticateToken_1.authenticateToken, authenticateToken_1.authorizeAdminOrManger, owner_controller_1.deleteRestaurant);
router.delete("/deleteOwner", [
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("有効なメールアドレスを入力してください"),
    (0, express_validator_1.check)("password").notEmpty().withMessage("パスワードが間違っています。"),
], authenticateToken_1.authenticateToken, authenticateToken_1.authorizeAdminOrManger, owner_controller_1.deleteOwner);
exports.default = router;
