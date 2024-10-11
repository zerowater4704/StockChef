import { Request, Response } from "express";
import Restaurant from "../model/Restaurant";
import User from "../model/User";
import mongoose from "mongoose";

// オーナーが従業員をレストランに参加させる
export const addEmployeeToRestaurant = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user?.id;
    const { employeeEmail } = req.body;

    const restaurant = await Restaurant.findOne({ adminId: ownerId });
    if (!restaurant) {
      res.status(404).json({ message: "レストランが見つかりません。" });
      return;
    }

    const employee = await User.findOne({
      email: employeeEmail,
    });
    if (!employee) {
      res.status(404).json({ message: "従業員が見つかりません。" });
      return;
    }

    if (
      !employee?.restaurantId?.includes(
        restaurant._id as mongoose.Schema.Types.ObjectId
      )
    ) {
      employee.restaurantId?.push(
        restaurant._id as mongoose.Schema.Types.ObjectId
      );
    } else {
      res
        .status(400)
        .json({ message: "今の従業員は既にレストランに参加されています。" });
      return;
    }
    await employee.save();

    res
      .status(200)
      .json({ message: "従業員がレストランに追加出来ました", employee });
  } catch (error) {
    res
      .status(500)
      .json({ message: "addEmployeeToRestaurant apiからのエラーです", error });
  }
};

// 新しいレストラン追加
export const addNewRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    const { name, location } = req.body;
    const restaurant = new Restaurant({
      name,
      location,
      adminId: ownerId,
    });

    await restaurant.save();

    const owner = await User.findById(ownerId);

    if (!owner?.restaurantId) {
      res.status(404).json({ message: "オーナーが見つかりません" });
      return;
    }

    owner.restaurantId.push(restaurant._id as mongoose.Schema.Types.ObjectId);
    res
      .status(201)
      .json({ message: "新しいレストランが登録されました", owner, restaurant });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "addNewRestaurant APIで失敗しました。", error });
    return;
  }
};

// レストランに所属している従業員取得
export const getEmployeesByRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { restaurantId } = req.body;

    if (!restaurantId) {
      res.status(400).json({ message: "レストランを見つけません  " });
      return;
    }

    const employees = await User.find({ restaurantId });

    res.status(200).json({ employees });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "getEmployeesByRestaurant APIで失敗しました。" });
  }
};

// 特定のレストランの情報を取得
export const getRestaurantById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      res.status(404).json({ message: "レストランが見つかりません" });
      return;
    }

    res.status(200).json({ restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "getRestaurantById APIで失敗しました。" });
  }
};

// オーナーのすべてのレストラン取得
export const getAllRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      res.status(400).json({ message: "オーナーIDが見つかりません。" });
      return;
    }
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    const restaurants = await Restaurant.find({ adminId: ownerObjectId });
    res.status(200).json({ restaurants });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "getRestaurant APIで失敗しました。", error });
    return;
  }
};

// 特定のレストランの削除
export const deleteRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.user?.id;
    const restaurantId = req.params.id;

    if (!restaurantId) {
      res.status(400).json({ message: "レストランが見つかりません", ownerId });
      return;
    }

    const restaurant = await Restaurant.findByIdAndDelete(restaurantId);

    res.status(200).json({ message: "レストランが削除されました", restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "deleteRestaurant APIで失敗しました。" });
  }
};
