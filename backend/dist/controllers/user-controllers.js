"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const User_1 = __importDefault(require("../model/User"));
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("バリデーションエラー", errors.array());
        res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, role } = req.body;
    const existingUser = yield User_1.default.findOne({ email });
    if (existingUser) {
        console.log("ユーザーは既に存在します", existingUser);
        res.status(400).json({ message: "ユーザーは既に存在します" });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 12);
    const newUser = new User_1.default({ name, email, password: hashedPassword, role });
    try {
        const user = yield newUser.save();
        res.status(201).json({ message: "ユーザーが登録でいました。", user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "サーバーエラー" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("バリデーションエラー", errors.array());
        res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "ユーザーが見つかりません" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "パスワードが間違っています" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, role: user.role },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "サーバーエラー" });
    }
});
exports.login = login;
