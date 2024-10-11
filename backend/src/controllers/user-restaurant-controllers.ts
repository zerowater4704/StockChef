import { Request, Response } from "express";
import Restaurant from "../model/Restaurant";
import User from "../model/User";

export const getAllRestaurantByEmployee = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ message: "従業員を見つかりません" });
      return;
    }

    const user = await User.findById(userId);
    if (!user || !user.restaurantId) {
      res.status(404).json({ message: "参加しているレストランがありません" });
      return;
    }

    const restaurants = await Restaurant.find({
      _id: { $in: user.restaurantId },
    });
    res.status(200).json({ restaurants });
  } catch (error) {
    res
      .status(500)
      .json({ message: "getAllRestaurantByEmployee apiエラーです", error });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      res.status(404).json({ message: "レストランが見つかりません" });
      return;
    }

    res.status(200).json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: "getRestaurantById APIで失敗しました。" });
  }
};
