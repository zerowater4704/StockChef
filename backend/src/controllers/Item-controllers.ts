import { Request, Response } from "express";
import Item from "../model/Item";
import Categories from "../model/Categories";
import mongoose from "mongoose";

export const addItemToCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const categoryId = req.params.id;
  const { name, stock } = req.body;

  try {
    const newItem = new Item({ name, stock });
    await newItem.save();

    const category = await Categories.findById(categoryId);
    if (!category) {
      res.status(404).json({ message: "カテゴリーが見つかりません" });
      return;
    }

    category.items.push(newItem._id as mongoose.Schema.Types.ObjectId);
    await category.save();

    res.status(201).json({
      message: "addItemToCategory 登録に成功しました。",
      newItem,
      category,
    });
  } catch (error) {
    console.error("Error in crateItem:", error);
    res
      .status(500)
      .json({ message: "addItemToCategory api errorです。", error });
  }
};

export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const itemId = req.params.id;

    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404).json({ message: "アイテムが見つかりません" });
      return;
    }

    res.status(200).json({ item });
  } catch (error) {
    console.error("Error in getItem:", error);
    res.status(500).json({ message: "getItem api errorです。", error });
  }
};

export const updateItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const itemId = req.params.id;
  const { name, stock } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404).json({ message: "アイテムが見つかりません" });
      return;
    }

    const updateItem = await Item.findByIdAndUpdate(
      itemId,
      { name, stock },
      { new: true }
    );
    res.status(200).json(updateItem);
  } catch (error) {
    console.error("Error in updateItem:", error);
    res.status(500).json({ message: "updateItem api errorです。", error });
  }
};

export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const itemId = req.params.id;

  try {
    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404).json({ message: "アイテムが見つかりません" });
      return;
    }

    await Item.findByIdAndDelete(itemId);
    res.status(200).json({ message: "アイテムが削除されました" });
  } catch (error) {
    res.status(500).json({ message: "deleteItem api errorです。", error });
  }
};
