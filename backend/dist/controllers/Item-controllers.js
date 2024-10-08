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
exports.deleteItem = exports.updateItem = exports.getItem = exports.addItemToCategory = void 0;
const Item_1 = __importDefault(require("../model/Item"));
const Categories_1 = __importDefault(require("../model/Categories"));
const addItemToCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    const { name, stock } = req.body;
    try {
        const newItem = new Item_1.default({ name, stock });
        yield newItem.save();
        const category = yield Categories_1.default.findById(categoryId);
        if (!category) {
            res.status(404).json({ message: "カテゴリーが見つかりません" });
            return;
        }
        category.items.push(newItem._id);
        yield category.save();
        res.status(201).json({
            message: "addItemToCategory 登録に成功しました。",
            newItem,
            category,
        });
    }
    catch (error) {
        console.error("Error in crateItem:", error);
        res
            .status(500)
            .json({ message: "addItemToCategory api errorです。", error });
    }
});
exports.addItemToCategory = addItemToCategory;
const getItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.id;
        const item = yield Item_1.default.findById(itemId);
        if (!item) {
            res.status(404).json({ message: "アイテムが見つかりません" });
            return;
        }
        res.status(200).json({ item });
    }
    catch (error) {
        console.error("Error in getItem:", error);
        res.status(500).json({ message: "getItem api errorです。", error });
    }
});
exports.getItem = getItem;
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.id;
    const { name, stock } = req.body;
    try {
        const item = yield Item_1.default.findById(itemId);
        if (!item) {
            res.status(404).json({ message: "アイテムが見つかりません" });
            return;
        }
        const updateItem = yield Item_1.default.findByIdAndUpdate(itemId, { name, stock }, { new: true });
        res.status(200).json(updateItem);
    }
    catch (error) {
        console.error("Error in updateItem:", error);
        res.status(500).json({ message: "updateItem api errorです。", error });
    }
});
exports.updateItem = updateItem;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.id;
    try {
        const item = yield Item_1.default.findById(itemId);
        if (!item) {
            res.status(404).json({ message: "アイテムが見つかりません" });
            return;
        }
        yield Item_1.default.findByIdAndDelete(itemId);
        res.status(200).json({ message: "アイテムが削除されました" });
    }
    catch (error) {
        res.status(500).json({ message: "deleteItem api errorです。", error });
    }
});
exports.deleteItem = deleteItem;
