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
exports.deleteCategory = exports.getCategory = exports.getCategories = exports.createCategory = void 0;
const Categories_1 = __importDefault(require("../model/Categories"));
const Item_1 = __importDefault(require("../model/Item"));
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const category = new Categories_1.default({ name });
        yield category.save();
        res
            .status(201)
            .json({ message: "createCategory 登録に成功しまいした。", category });
    }
    catch (error) {
        res.status(500).json({ message: "createCategory api errorです。", error });
    }
});
exports.createCategory = createCategory;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Categories_1.default.find().populate("items");
        const findItems = yield Item_1.default.find();
        res.status(200).json({ categories, findItems });
    }
    catch (error) {
        console.error("Error in getCategories:", error);
        res.status(500).json({ message: "getCategories api errorです。", error });
    }
});
exports.getCategories = getCategories;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    try {
        const findCategory = yield Categories_1.default.findById(categoryId).populate("items");
        if (!findCategory) {
            res.status(404).json({ message: "カテゴリーが見つかりません" });
            return;
        }
        res.status(200).json({ findCategory });
    }
    catch (error) {
        res.status(500).json({ message: "getCategory api errorです。", error });
    }
});
exports.getCategory = getCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    try {
        const findCategory = yield Categories_1.default.findById(categoryId);
        if (!findCategory) {
            res.status(404).json({ message: "カテゴリーが見つかりません" });
            return;
        }
        yield Categories_1.default.findByIdAndDelete(categoryId);
        res.status(200).json({ message: "カテゴリーを削除しました" });
    }
    catch (error) {
        console.error("Error in getCategories:", error);
        res.status(500).json({ message: "deleteCategory api errorです。", error });
    }
});
exports.deleteCategory = deleteCategory;
