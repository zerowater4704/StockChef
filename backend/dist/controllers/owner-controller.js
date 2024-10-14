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
exports.deleteOwner = exports.updateOwner = exports.refreshAccessToken = exports.ownerLogout = exports.ownerLogin = exports.registerOwner = void 0;
const User_1 = __importDefault(require("../model/User"));
const Restaurant_1 = __importDefault(require("../model/Restaurant"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const redisClient_1 = __importDefault(require("../redis/redisClient"));
function generateJoiningKey() {
    return Math.random().toString(36).slice(2, 8);
}
const registerOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("バリデーションエラー", errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { name, email, password, restaurantName, location } = req.body;
    const existingUser = yield User_1.default.findOne({ email });
    if (existingUser) {
        console.log("ユーザーは既に存在します", existingUser);
        res.status(400).json({ message: "ユーザーは既に存在します" });
        return;
    }
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const owner = new User_1.default({
            name,
            email,
            password: hashedPassword,
            role: "admin",
        });
        yield owner.save();
        const joiningKey = generateJoiningKey();
        const restaurant = new Restaurant_1.default({
            name: restaurantName,
            location,
            adminId: owner._id,
            joiningKey,
        });
        yield restaurant.save();
        // 4. オーナーにレストランIDをセット
        owner.restaurantId = [restaurant._id];
        yield owner.save();
        res.status(201).json({
            message: "オーナー登録に成功しました",
            owner,
            restaurant,
            joiningKey,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "registerOwner APIで失敗しました。" });
    }
});
exports.registerOwner = registerOwner;
const ownerLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("バリデーションエラー", errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    try {
        const owner = yield User_1.default.findOne({ email });
        if (!owner) {
            res.status(400).json({ message: "Emailが間違っています" });
            return;
        }
        if (owner.role !== "admin") {
            res.status(400).json({
                message: "今のアカウントはオーナーのアカウントではありません",
            });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, owner.password);
        if (!isMatch) {
            res.status(400).json({ message: "パスワードが間違っています" });
            return;
        }
        // Restaurant nameを取得する (仮定)
        let restaurantName = "";
        if (owner.restaurantId && owner.restaurantId.length > 0) {
            const restaurant = yield Restaurant_1.default.findById(owner.restaurantId[0]); // 1つのレストランのみ対象
            if (restaurant) {
                restaurantName = restaurant.name; // レストラン名を取得
            }
        }
        const ownerAccessToken = jsonwebtoken_1.default.sign({ id: owner._id, role: owner.role }, process.env.JWT_SECRET, { expiresIn: "10m" });
        const refreshTokenOwner = jsonwebtoken_1.default.sign({ id: owner._id, role: owner.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
        res.cookie("refreshTokenOwner", refreshTokenOwner, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            ownerAccessToken,
            owner: Object.assign(Object.assign({}, owner.toObject()), { restaurantName }),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "ownerLogin APIで失敗しました。" });
    }
});
exports.ownerLogin = ownerLogin;
const ownerLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(400).json({ message: "トークンがありません" });
        return;
    }
    yield redisClient_1.default.set(token, "blacklisted", { EX: 3600 });
    res.clearCookie("refreshTokenOwner", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });
    res.status(200).json({ message: "ログアウトしました" });
});
exports.ownerLogout = ownerLogout;
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshTokenOwner;
    console.log("refreshAccessTokenOwner req.cookies: ", req.cookies);
    console.log("refreshAccessTokenOwner refreshToken: ", refreshToken);
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
const updateOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const owner = yield User_1.default.findById(ownerId);
        if (!owner) {
            res.status(404).json({ message: "オーナーが見つかりません" });
            return;
        }
        const { name, email, password, newPassword } = req.body;
        if (name)
            owner.name = name;
        if (email)
            owner.email = email;
        if (password && newPassword) {
            const isMatch = yield bcrypt_1.default.compare(password, owner.password);
            if (!isMatch) {
                res.status(400).json({ message: "パスワードが間違っています" });
                return;
            }
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            owner.password = hashedPassword;
        }
        yield owner.save();
        res.status(200).json({ message: "オーナー情報が更新されました", owner });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "updateOwner APIで失敗しました。" });
    }
});
exports.updateOwner = updateOwner;
const deleteOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("バリデーションエラー", errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const { password } = req.body;
        const owner = yield User_1.default.findById(ownerId);
        if (!owner) {
            res.status(400).json({ message: "オーナーが見つかりません" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, owner.password);
        if (!isMatch) {
            res.status(400).json({ message: "パスワードが間違っています" });
            return;
        }
        const deleteOwner = yield User_1.default.findByIdAndDelete(ownerId);
        res.status(200).json({ message: "オーナーが削除されました", deleteOwner });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "deleteOwner APIで失敗しました。" });
    }
});
exports.deleteOwner = deleteOwner;
