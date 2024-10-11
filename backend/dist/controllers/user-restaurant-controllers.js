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
exports.getRestaurantById = exports.getAllRestaurantByEmployee = void 0;
const Restaurant_1 = __importDefault(require("../model/Restaurant"));
const User_1 = __importDefault(require("../model/User"));
const getAllRestaurantByEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(400).json({ message: "従業員を見つかりません" });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user || !user.restaurantId) {
            res.status(404).json({ message: "参加しているレストランがありません" });
            return;
        }
        const restaurants = yield Restaurant_1.default.find({
            _id: { $in: user.restaurantId },
        });
        res.status(200).json({ restaurants });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "getAllRestaurantByEmployee apiエラーです", error });
    }
});
exports.getAllRestaurantByEmployee = getAllRestaurantByEmployee;
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
        res.status(500).json({ message: "getRestaurantById APIで失敗しました。" });
    }
});
exports.getRestaurantById = getRestaurantById;
