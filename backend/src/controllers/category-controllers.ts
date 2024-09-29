import { Request, Response } from "express";
import Categories from "../model/Categories";
import Item from "../model/Item";

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;
    const category = new Categories({ name });
    await category.save();
    res
      .status(201)
      .json({ message: "createCategory 登録に成功しまいした。", category });
  } catch (error) {
    res.status(500).json({ message: "createCategory api errorです。", error });
  }
};

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Categories.find().populate("items");
    const findItems = await Item.find();
    res.status(200).json({ categories, findItems });
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.status(500).json({ message: "getCategories api errorです。", error });
  }
};

export const getCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const categoryId = req.params.id;
  try {
    const findCategory = await Categories.findById(categoryId).populate(
      "items"
    );
    if (!findCategory) {
      res.status(404).json({ message: "カテゴリーが見つかりません" });
      return;
    }
    res.status(200).json({ findCategory });
  } catch (error) {
    res.status(500).json({ message: "getCategory api errorです。", error });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const categoryId = req.params.id;
  try {
    const findCategory = await Categories.findById(categoryId);

    if (!findCategory) {
      res.status(404).json({ message: "カテゴリーが見つかりません" });
      return;
    }
    await Categories.findByIdAndDelete(categoryId);
    res.status(200).json({ message: "カテゴリーを削除しました" });
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.status(500).json({ message: "deleteCategory api errorです。", error });
  }
};
