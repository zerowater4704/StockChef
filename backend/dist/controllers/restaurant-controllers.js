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
exports.deleteRestaurant = exports.getAllRestaurant = exports.getRestaurantById = exports.getEmployeesByRestaurant = exports.addNewRestaurant = exports.addEmployeeToRestaurant = void 0;
const Restaurant_1 = __importDefault(require("../model/Restaurant"));
const User_1 = __importDefault(require("../model/User"));
const mongoose_1 = __importDefault(require("mongoose"));
// オーナーが従業員をレストランに参加させる
const addEmployeeToRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { employeeEmail } = req.body;
        const restaurant = yield Restaurant_1.default.findOne({ adminId: ownerId });
        if (!restaurant) {
            res.status(404).json({ message: "レストランが見つかりません。" });
            return;
        }
        const employee = yield User_1.default.findOne({
            email: employeeEmail,
        });
        if (!employee) {
            res.status(404).json({ message: "従業員が見つかりません。" });
            return;
        }
        if (!((_b = employee === null || employee === void 0 ? void 0 : employee.restaurantId) === null || _b === void 0 ? void 0 : _b.includes(restaurant._id))) {
            (_c = employee.restaurantId) === null || _c === void 0 ? void 0 : _c.push(restaurant._id);
        }
        else {
            res
                .status(400)
                .json({ message: "今の従業員は既にレストランに参加されています。" });
            return;
        }
        yield employee.save();
        res
            .status(200)
            .json({ message: "従業員がレストランに追加出来ました", employee });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "addEmployeeToRestaurant apiからのエラーです", error });
    }
});
exports.addEmployeeToRestaurant = addEmployeeToRestaurant;
// 新しいレストラン追加
const addNewRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { name, location } = req.body;
        const restaurant = new Restaurant_1.default({
            name,
            location,
            adminId: ownerId,
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
        res
            .status(500)
            .json({ message: "addNewRestaurant APIで失敗しました。", error });
        return;
    }
});
exports.addNewRestaurant = addNewRestaurant;
// レストランに所属している従業員取得
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
// 特定のレストランの情報を取得
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
// オーナーのすべてのレストラン取得
const getAllRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!ownerId) {
            res.status(400).json({ message: "オーナーIDが見つかりません。" });
            return;
        }
        const ownerObjectId = new mongoose_1.default.Types.ObjectId(ownerId);
        const restaurants = yield Restaurant_1.default.find({ adminId: ownerObjectId });
        res.status(200).json({ restaurants });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "getRestaurant APIで失敗しました。", error });
        return;
    }
});
exports.getAllRestaurant = getAllRestaurant;
// 特定のレストランの削除
const deleteRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const restaurantId = req.params.id;
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
