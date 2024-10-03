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
exports.deleteOwner = exports.deleteRestaurant = exports.getRestaurant = exports.getRestaurantById = exports.getEmployeesByRestaurant = exports.updateRestaurant = exports.updateOwner = exports.addNewRestaurant = exports.getJoiningKey = exports.ownerLogin = exports.registerOwner = void 0;
const User_1 = __importDefault(require("../model/User"));
const Restaurant_1 = __importDefault(require("../model/Restaurant"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
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
        const isMatch = yield bcrypt_1.default.compare(password, owner.password);
        if (!isMatch) {
            res.status(400).json({ message: "パスワードが間違っています" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: owner._id, role: owner.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token, owner });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "ownerLogin APIで失敗しました。" });
    }
});
exports.ownerLogin = ownerLogin;
const getJoiningKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const restaurant = yield Restaurant_1.default.findOne({ adminId: ownerId });
        if (!restaurant) {
            res.status(404).json({ message: "レストランが見つかりません" });
            return;
        }
        res.status(200).json({ joiningKey: restaurant.joiningKey });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "getJoiningKey APIで失敗しました。" });
    }
});
exports.getJoiningKey = getJoiningKey;
const addNewRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { name, location } = req.body;
        const restaurant = new Restaurant_1.default({
            name,
            location,
            adminId: ownerId,
            joiningKey: generateJoiningKey(),
        });
        yield restaurant.save();
        const owner = yield User_1.default.findById(ownerId);
        if (!(owner === null || owner === void 0 ? void 0 : owner.restaurantId)) {
            res.status(404).json({ message: "オーナーが見つかりません" });
            return;
        }
        owner.restaurantId.push(restaurant._id);
        res
            .status(201)
            .json({ message: "新しいレストランが登録されました", owner, restaurant });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "addNewRestaurant APIで失敗しました。" });
    }
});
exports.addNewRestaurant = addNewRestaurant;
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
const updateRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { restaurantId, name, location } = req.body;
        const restaurant = yield Restaurant_1.default.findById({
            _id: restaurantId,
            adminId: ownerId,
        });
        if (!restaurant) {
            res.status(404).json({ message: "レストランが見つかりません" });
            return;
        }
        if (name)
            restaurant.name = name;
        if (location)
            restaurant.location = location;
        yield restaurant.save();
        res
            .status(200)
            .json({ message: "レストラン情報が更新されました", restaurant });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "updateRestaurant APIで失敗しました。" });
    }
});
exports.updateRestaurant = updateRestaurant;
const getEmployeesByRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId } = req.body;
        if (!restaurantId) {
            res.status(400).json({ message: "レストランを見つけません  " });
            return;
        }
        const employees = yield User_1.default.find({ restaurantId });
        res.status(200).json({ employees });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "getEmployeesByRestaurant APIで失敗しました。" });
    }
});
exports.getEmployeesByRestaurant = getEmployeesByRestaurant;
const getRestaurantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const restaurant = yield Restaurant_1.default.findById(id);
        if (!restaurant) {
            res.status(404).json({ message: "レストランが見つかりません" });
            return;
        }
        res.status(200).json({ restaurant });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "getRestaurantById APIで失敗しました。" });
    }
});
exports.getRestaurantById = getRestaurantById;
const getRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const restaurant = yield Restaurant_1.default.find({ adminId: ownerId });
        res.status(200).json({ restaurant });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "getRestaurant APIで失敗しました。" });
    }
});
exports.getRestaurant = getRestaurant;
const deleteRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { restaurantId } = req.body;
        if (!restaurantId) {
            res.status(400).json({ message: "レストランが見つかりません", ownerId });
            return;
        }
        const restaurant = yield Restaurant_1.default.findByIdAndDelete(restaurantId);
        res.status(200).json({ message: "レストランが削除されました", restaurant });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "deleteRestaurant APIで失敗しました。" });
    }
});
exports.deleteRestaurant = deleteRestaurant;
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
