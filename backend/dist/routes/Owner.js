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
router.put("/updateOwner", authenticateToken_1.authenticateToken, authenticateToken_1.authorizeAdminOrManger, owner_controller_1.updateOwner);
router.delete("/deleteOwner", [
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("有効なメールアドレスを入力してください"),
    (0, express_validator_1.check)("password").notEmpty().withMessage("パスワードが間違っています。"),
], authenticateToken_1.authenticateToken, authenticateToken_1.authorizeAdminOrManger, owner_controller_1.deleteOwner);
// router.get(
//   "/joiningKey",
//   authenticateToken,
//   authorizeAdminOrManger,
//   getJoiningKey
// );
// router.put(
//   "/updateRestaurant",
//   authenticateToken,
//   authorizeAdminOrManger,
//   updateRestaurant
// );
// router.get(
//   "/employee",
//   authenticateToken,
//   authorizeAdminOrManger,
//   getEmployeesByRestaurant
// );
// router.get(
//   "/restaurant/:id",
//   authenticateToken,
//   authorizeAdminOrManger,
//   getRestaurantById
// );
// router.get(
//   "/restaurant",
//   authenticateToken,
//   authorizeAdminOrManger,
//   getRestaurant
// );
// router.delete(
//   "/deleteRestaurant",
//   authenticateToken,
//   authorizeAdminOrManger,
//   deleteRestaurant
// );
exports.default = router;
