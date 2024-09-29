"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controllers_1 = require("../controllers/user-controllers");
const router = (0, express_1.Router)();
router.post("/signup", [
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("有効なメールアドレスを入力してください"),
    (0, express_validator_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("パスワードは6文字以上で入力してください"),
    (0, express_validator_1.check)("name").notEmpty().withMessage("名前を入力してください"),
], user_controllers_1.signup);
router.post("/login", [
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("有効なメールアドレスを入力してください"),
    (0, express_validator_1.check)("password").notEmpty().withMessage("パスワードが間違っています。"),
], user_controllers_1.login);
exports.default = router;
