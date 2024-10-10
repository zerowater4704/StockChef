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
exports.getAllConfirmedShift = exports.updatePendingShift = exports.confirmShiftsByRestaurant = exports.getAllPendingShift = void 0;
const User_1 = __importDefault(require("../model/User"));
const Shift_1 = __importDefault(require("../model/Shift"));
// 従業員IDをレストランIDで取得するヘルパー関数
const getEmployeesIdsByRestaurant = (restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    const employees = yield User_1.default.find({ restaurantId });
    return employees.map((employee) => employee._id);
});
// レストランごとの確定前のシフト取得
const getAllPendingShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { year, month, restaurantId } = req.body;
        if (!restaurantId) {
            res.status(400).json({ message: "レストランIDが指定されていません" });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "ユーザーが見つかりません" });
            return;
        }
        if (!user.restaurantId || !user.restaurantId.includes(restaurantId)) {
            res
                .status(403)
                .json({ message: "このレストランのアクセス権がありません。" });
        }
        // レストランに所属する従業員のID取得
        const employeeIds = yield getEmployeesIdsByRestaurant(restaurantId);
        const allEmployeeShifts = yield Shift_1.default.find({
            userId: { $in: employeeIds },
            year,
            month,
        }).populate("userId", "name");
        // 全体の従業員のシフトをループ
        const pendingShifts = allEmployeeShifts.flatMap((shiftDoc) => 
        // 従業員ごとの日別シフトをループ
        shiftDoc.shifts
            .filter((shift) => !shift.confirmed)
            .map((shift) => ({
            date: shift.date,
            startTime: shift.startTime,
            finishTime: shift.finishTime,
            confirmed: shift.confirmed,
            userName: shiftDoc.userId.name, // `userId`に`name`プロパティを追加
        })));
        res.status(200).json({ pendingShifts });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "getAllPendingShift apiのエラーです", error });
    }
});
exports.getAllPendingShift = getAllPendingShift;
// レストランごとのシフト確定
const confirmShiftsByRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { year, month, restaurantId } = req.body;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "ユーザーが見つかりません" });
            return;
        }
        if (!user.restaurantId || !user.restaurantId.includes(restaurantId)) {
            res.status(403).json({ message: "レストランのアクセス権がありません" });
            return;
        }
        const employeeIds = yield getEmployeesIdsByRestaurant(restaurantId);
        const allEmployeeShifts = yield Shift_1.default.find({
            userId: { $in: employeeIds },
            year,
            month,
        });
        allEmployeeShifts.forEach((shiftDoc) => {
            shiftDoc.shifts.forEach((shift) => {
                if (!shift.confirmed) {
                    shift.confirmed = true;
                }
            });
            shiftDoc.save();
        });
        res.status(200).json({ message: "シフト確定されました" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "confirmShiftsByRestaurant apiのエラーです", error });
    }
});
exports.confirmShiftsByRestaurant = confirmShiftsByRestaurant;
//確定前のシフトを修正
const updatePendingShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { year, month, restaurantId, date, startTime, finishTime } = req.body;
        if (!restaurantId) {
            res.status(400).json({ message: "レストランを見つかりません" });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "ユーザーが見つかりません" });
            return;
        }
        if (!user.restaurantId || !user.restaurantId.includes(restaurantId)) {
            res.status(403).json({ message: "レストランのアクセス権がありません" });
            return;
        }
        const employeeIds = yield getEmployeesIdsByRestaurant(restaurantId);
        // 指定された年、月の日付のシフトを取得
        const shiftDoc = yield Shift_1.default.findOne({
            userId: { $in: employeeIds },
            year,
            month,
        });
        if (!shiftDoc) {
            res.status(404).json({ message: "シフトが見つかりません" });
            return;
        }
        // 修正したいシフトを探す
        const shiftToUpdate = shiftDoc.shifts.find((shift) => shift.date === date);
        if (!shiftToUpdate) {
            res
                .status(404)
                .json({ message: "指定された日付のシフトが見つかりません" });
            return;
        }
        if (shiftToUpdate.confirmed) {
            res.status(400).json({ message: "確定されたシフトが修正できません" });
            return;
        }
        shiftToUpdate.startTime = startTime;
        shiftToUpdate.finishTime = finishTime;
        yield shiftDoc.save();
        res
            .status(200)
            .json({ message: "シフトを修正しました", shift: shiftToUpdate });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "updatePendingShift apiのエラーです", error });
    }
});
exports.updatePendingShift = updatePendingShift;
// 確定してシフト取得
const getAllConfirmedShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { year, month, restaurantId } = req.body;
        if (!restaurantId) {
            res.status(400).json({ message: "レストランIDが指定されていません" });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "ユーザーが見つかりません" });
            return;
        }
        if (!user.restaurantId || !user.restaurantId.includes(restaurantId)) {
            res
                .status(403)
                .json({ message: "このレストランのアクセス権がありません。" });
        }
        // レストランに所属する従業員のID取得
        const employeeIds = yield getEmployeesIdsByRestaurant(restaurantId);
        const allEmployeeShifts = yield Shift_1.default.find({
            userId: { $in: employeeIds },
            year,
            month,
        }).populate("userId", "name");
        // 全体の従業員のシフトをループ
        const pendingShifts = allEmployeeShifts.flatMap((shiftDoc) => 
        // 従業員ごとの日別シフトをループ
        shiftDoc.shifts
            .filter((shift) => shift.confirmed)
            .map((shift) => ({
            date: shift.date,
            startTime: shift.startTime,
            finishTime: shift.finishTime,
            confirmed: shift.confirmed,
            userName: shiftDoc.userId.name, // `userId`に`name`プロパティを追加
        })));
        res.status(200).json({ pendingShifts });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "getAllPendingShift apiのエラーです", error });
    }
});
exports.getAllConfirmedShift = getAllConfirmedShift;
