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
exports.confirmShift = exports.deleteShift = exports.updateShift = exports.getShifts = exports.requestShift = void 0;
const Shift_1 = __importDefault(require("../model/Shift"));
const requestShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, shiftDate, shiftTime } = req.body;
        const existingShift = yield Shift_1.default.findOne({ userId, shiftDate });
        if (existingShift && existingShift.confirmedShift) {
            res.status(400).json({ error: "既に確定されたシフトがあります。" });
            return;
        }
        if (existingShift) {
            res.status(400).json({ error: "既にシフト希望が出されています。" });
            return;
        }
        const newShift = new Shift_1.default({ userId, shiftDate, shiftTime });
        yield newShift.save();
        res
            .status(200)
            .json({ message: "シフトリクエストが送信されました", newShift });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "requestShift APIで失敗しました。" });
    }
});
exports.requestShift = requestShift;
const getShifts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shifts = yield Shift_1.default.find().populate("userId", "name");
        res.status(200).json({ shifts });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "getShifts APIで失敗しました。" });
    }
});
exports.getShifts = getShifts;
const updateShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { shiftDate, shiftTime } = req.body;
        const updateTime = yield Shift_1.default.findOneAndUpdate({ userId, shiftDate }, { shiftTime }, { new: true });
        if (!updateTime) {
            res.status(404).json({ message: "シフトが見つかりません" });
            return;
        }
        yield updateTime.save();
        res.status(200).json({ message: "シフトが更新されました", updateTime });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "updateShift APIで失敗しました。" });
    }
});
exports.updateShift = updateShift;
const deleteShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        if (!userId) {
            res.status(400).json({ message: "ユーザーが見つかりません" });
            return;
        }
        yield Shift_1.default.findByIdAndDelete(userId);
        res.status(200).json({ message: "シフトが削除されました" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "deleteShift APIで失敗しました。" });
    }
});
exports.deleteShift = deleteShift;
const confirmShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, shiftDate, confirmedShift } = req.body;
        const shiftConfirm = yield Shift_1.default.findOne({ userId, shiftDate });
        if (!shiftConfirm) {
            res.status(400).json({ message: "シフトが見つかりません" });
            return;
        }
        shiftConfirm.confirmedShift = confirmedShift;
        yield shiftConfirm.save();
        res.status(200).json({ message: "シフトが確定されました", shiftConfirm });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "confirmShift APIで失敗しました。" });
    }
});
exports.confirmShift = confirmShift;
