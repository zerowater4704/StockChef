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
exports.deleteUser = exports.deleteRestaurant = exports.refreshAccessToken = exports.userLogout = exports.login = exports.signup = void 0;
const User_1 = __importDefault(require("../model/User"));
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redisClient_1 = __importDefault(require("../redis/redisClient"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("バリデーションエラー", errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { name, email, password, role } = req.body;
    const existingUser = yield User_1.default.findOne({ email });
    if (existingUser) {
        console.log("ユーザーは既に存在します", existingUser);
        res.status(400).json({ message: "ユーザーは既に存在します" });
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const newUser = new User_1.default({
        name,
        email,
        password: hashedPassword,
        role,
    });
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
        if (user.role !== "employee" && user.role !== "manager") {
            res.status(400).json({
                message: "今のアカウントは従業員のアカウントではありません",
            });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "パスワードが間違っています" });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "10m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                restaurantId: user.restaurantId,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "サーバーエラー" });
    }
});
exports.login = login;
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(400).json({ message: "トークンがありません" });
        return;
    }
    yield redisClient_1.default.set(token, "blacklisted", { EX: 3600 });
    res.status(200).json({ message: "ログアウトしました" });
});
exports.userLogout = userLogout;
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(403).json({ message: "リフレッシュトークンがありません" });
        return;
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
            return res
                .status(403)
                .json({ message: "リフレッシュトークンが無効です" });
        const newAccessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "10m" });
        res.status(200).json({ accessToken: newAccessToken });
    });
});
exports.refreshAccessToken = refreshAccessToken;
const deleteRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId, restaurantId } = req.body;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "ユーザーが見つかりません" });
            return;
        }
        user.restaurantId = (_a = user.restaurantId) === null || _a === void 0 ? void 0 : _a.filter((id) => id.toString() !== restaurantId);
        yield user.save();
        res.status(200).json({ message: "レストランを削除しました", restaurantId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "deleteRestaurant api エラーです" });
    }
});
exports.deleteRestaurant = deleteRestaurant;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("バリデーションエラー", errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const { password } = req.body;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(400).json({ message: "ユーザーIDがありません" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "パスワードが間違っています" });
            return;
        }
        yield User_1.default.findByIdAndDelete(userId);
        res.status(200).json({ message: "ユーザーが削除されました" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "deleteUser api エラーです" });
    }
});
exports.deleteUser = deleteUser;
