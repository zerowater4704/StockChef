import User from "../model/User";
import Restaurant from "../model/Restaurant";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

function generateJoiningKey(): string {
  return Math.random().toString(36).slice(2, 8);
}

export const registerOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("バリデーションエラー", errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { name, email, password, restaurantName, location } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("ユーザーは既に存在します", existingUser);
    res.status(400).json({ message: "ユーザーは既に存在します" });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
    await owner.save();

    const joiningKey = generateJoiningKey();
    const restaurant = new Restaurant({
      name: restaurantName,
      location,
      adminId: owner._id,
      joiningKey,
    });

    await restaurant.save();

    // 4. オーナーにレストランIDをセット
    owner.restaurantId = [restaurant._id] as mongoose.Schema.Types.ObjectId[];
    await owner.save();

    res.status(201).json({
      message: "オーナー登録に成功しました",
      owner,
      restaurant,
      joiningKey,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "registerOwner APIで失敗しました。" });
  }
};

export const ownerLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("バリデーションエラー", errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    const owner = await User.findOne({ email });

    if (!owner) {
      res.status(400).json({ message: "Emailが間違っています" });
      return;
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      res.status(400).json({ message: "パスワードが間違っています" });
      return;
    }

    const token = jwt.sign(
      { id: owner._id, role: owner.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, owner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ownerLogin APIで失敗しました。" });
  }
};

export const getJoiningKey = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ownerId = req.user?.id;

  try {
    const restaurant = await Restaurant.findOne({ adminId: ownerId });

    if (!restaurant) {
      res.status(404).json({ message: "レストランが見つかりません" });
      return;
    }

    res.status(200).json({ joiningKey: restaurant.joiningKey });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "getJoiningKey APIで失敗しました。" });
  }
};

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
      joiningKey: generateJoiningKey(),
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
    res.status(500).json({ message: "addNewRestaurant APIで失敗しました。" });
  }
};

export const updateOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    const owner = await User.findById(ownerId);

    if (!owner) {
      res.status(404).json({ message: "オーナーが見つかりません" });
      return;
    }

    const { name, email, password, newPassword } = req.body;

    if (name) owner.name = name;
    if (email) owner.email = email;

    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, owner.password);

      if (!isMatch) {
        res.status(400).json({ message: "パスワードが間違っています" });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      owner.password = hashedPassword;
    }

    await owner.save();

    res.status(200).json({ message: "オーナー情報が更新されました", owner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "updateOwner APIで失敗しました。" });
  }
};

export const updateRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    const { restaurantId, name, location } = req.body;

    const restaurant = await Restaurant.findById({
      _id: restaurantId,
      adminId: ownerId,
    });

    if (!restaurant) {
      res.status(404).json({ message: "レストランが見つかりません" });
      return;
    }

    if (name) restaurant.name = name;
    if (location) restaurant.location = location;

    await restaurant.save();

    res
      .status(200)
      .json({ message: "レストラン情報が更新されました", restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "updateRestaurant APIで失敗しました。" });
  }
};

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

export const getRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.user?.id;
    const restaurant = await Restaurant.find({ adminId: ownerId });

    res.status(200).json({ restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "getRestaurant APIで失敗しました。" });
  }
};

export const deleteRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.user?.id;
    const { restaurantId } = req.body;

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

export const deleteOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("バリデーションエラー", errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const ownerId = req.user?.id;
  try {
    const { password } = req.body;

    const owner = await User.findById(ownerId);
    if (!owner) {
      res.status(400).json({ message: "オーナーが見つかりません" });
      return;
    }

    const isMatch = await bcrypt.compare(password, owner.password as string);
    if (!isMatch) {
      res.status(400).json({ message: "パスワードが間違っています" });
      return;
    }

    const deleteOwner = await User.findByIdAndDelete(ownerId);

    res.status(200).json({ message: "オーナーが削除されました", deleteOwner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "deleteOwner APIで失敗しました。" });
  }
};
