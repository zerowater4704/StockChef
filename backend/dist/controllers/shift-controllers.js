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
exports.requestShifts = void 0;
const Shift_1 = __importDefault(require("../model/Shift"));
const requestShifts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { year, month, shifts } = req.body;
        const existingShift = yield Shift_1.default.findOne({ userId, year, month });
        if (existingShift) {
            res.status(400).json({ message: "既にその月のリクエストがあります。" });
            return;
        }
        const newShifts = new Shift_1.default({ userId, year, month, shifts });
        yield newShifts.save();
        res.status(200).json({ message: "シフト登録に成功しました。", newShifts });
    }
    catch (error) {
        res.status(500).json({ message: "requestShifts APIのエラーです", error });
    }
});
exports.requestShifts = requestShifts;
