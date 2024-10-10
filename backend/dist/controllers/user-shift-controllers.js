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
exports.deleteShift = exports.updateShift = exports.getConfirmedShifts = exports.getPendingShifts = exports.requestShifts = void 0;
const Shift_1 = __importDefault(require("../model/Shift"));
// ユーザーがシフトのリクエストを送る
const requestShifts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { year, month, shifts } = req.body;
        let shiftDoc = yield Shift_1.default.findOne({ userId, year, month });
        if (shiftDoc) {
            shifts.forEach((newShift) => {
                const existingShift = shiftDoc.shifts.find((shift) => shift.date === newShift.date);
                if (existingShift) {
                    res.status(400).json({
                        message: `${newShift.date}のシフトは既に登録されています`,
                    });
                    return;
                }
                shiftDoc.shifts.push(newShift);
            });
            yield shiftDoc.save();
            res.status(200).json({ message: "シフトが登録されました", shiftDoc });
        }
        else {
            const newShifts = new Shift_1.default({ userId, year, month, shifts });
            yield newShifts.save();
            res
                .status(200)
                .json({ message: "シフト登録に成功しました。", newShifts });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: "requestShifts APIのエラーです", error });
    }
});
exports.requestShifts = requestShifts;
//　ユーザーが確定前のシフト確認
const getPendingShifts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { year, month } = req.query;
        const shiftDoc = yield Shift_1.default.findOne({ userId, year, month });
        if (!shiftDoc) {
            res.status(404).json({ message: "シフトが見つかりません" });
            return;
        }
        const pendingShift = shiftDoc.shifts.filter((shift) => !shift.confirmed);
        res.status(200).json({ pendingShift });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "getPendingShifts apiのエラーです", error });
    }
});
exports.getPendingShifts = getPendingShifts;
// ユーザーが確定後のシフト確認
const getConfirmedShifts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { year, month } = req.query;
        const shiftDoc = yield Shift_1.default.findOne({ userId, year, month });
        if (!shiftDoc) {
            res.status(404).json({ message: "シフトが見つかりません" });
            return;
        }
        const confirmedShift = shiftDoc.shifts.filter((shift) => shift.confirmed);
        if (confirmedShift.length === 0) {
            res.status(200).json({ message: "まだ確定されたシフトがありません" });
        }
        else {
            res.status(200).json({ confirmedShift });
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "getPendingShifts apiのエラーです", error });
    }
});
exports.getConfirmedShifts = getConfirmedShifts;
// シフト更新(修正)
const updateShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { year, month, date, startTime, finishTime } = req.body;
        // 指定されたユーザーの指定された月のシフト情報を取得
        const shiftDoc = yield Shift_1.default.findOne({ userId, year, month });
        if (!shiftDoc) {
            res.status(404).json({ message: "シフトが見つかりません" });
            return;
        }
        // 該当の日付のシフトを探す:
        const shiftFind = shiftDoc.shifts.find((shift) => shift.date === date);
        if (!shiftFind) {
            res
                .status(404)
                .json({ message: "指定された日付のシフトを見つかりません" });
            return;
        }
        // 確定済みのシフトか確認:
        if (shiftFind.confirmed) {
            res.status(400).json({ message: "確定されたシフトは更新できません" });
            return;
        }
        else {
            // シフトの時間を更新:
            shiftFind.startTime = startTime;
            shiftFind.finishTime = finishTime;
            yield shiftDoc.save();
            res.status(200).json({ message: "シフトが更新されました", shiftDoc });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: "updateShift apiのエラーです", error });
    }
});
exports.updateShift = updateShift;
const deleteShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { year, month, date } = req.body;
        const shiftDoc = yield Shift_1.default.findOne({ userId, year, month });
        if (!shiftDoc) {
            res.status(404).json({ message: "シフトが見つかりません" });
            return;
        }
        // 特定の日付のシフトを探す:
        const shiftFind = shiftDoc.shifts.find((shift) => shift.date === date);
        if (!shiftFind) {
            res
                .status(404)
                .json({ message: "指定された日付のシフトを見つかりません" });
            return;
        }
        // 確定されたシフトかどうかの確認:
        if (shiftFind.confirmed) {
            res.status(400).json({ message: "確定されたシフトは削除できません" });
            return;
        }
        else {
            // シフトの削除:
            shiftDoc.shifts = shiftDoc.shifts.filter((shift) => shift.date !== date);
            yield shiftDoc.save();
            res.status(200).json({ message: "シフトが削除されました" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "deleteShift apiのエラーです", error });
    }
});
exports.deleteShift = deleteShift;
