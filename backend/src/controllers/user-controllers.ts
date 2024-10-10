import User from "../model/User";
import Restaurant from "../model/Restaurant";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("バリデーションエラー", errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("ユーザーは既に存在します", existingUser);
    res.status(400).json({ message: "ユーザーは既に存在します" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  try {
    const user = await newUser.save();
    res.status(201).json({ message: "ユーザーが登録でいました。", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "サーバーエラー" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("バリデーションエラー", errors.array());
    res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "ユーザーが見つかりません" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "パスワードが間違っています" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        restaurantId: user.restaurantId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "サーバーエラー" });
  }
};

export const joinRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("バリデーションエラー", errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { joiningKey } = req.body;
  const userId = req.user?.id;

  try {
    const restaurant = await Restaurant.findOne({ joiningKey });

    if (!restaurant) {
      res.status(400).json({ message: "レストランが見つかりません" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({ message: "ユーザーが見つかりません" });
      return;
    }

    if (
      !user.restaurantId?.includes(
        restaurant._id as mongoose.Schema.Types.ObjectId
      )
    ) {
      user.restaurantId?.push(restaurant._id as mongoose.Schema.Types.ObjectId);
    }

    await user.save();

    res.status(200).json({ message: "レストランに参加しました", user });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "joinRestaurant api エラーです" });
    return;
  }
};

export const deleteRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, restaurantId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "ユーザーが見つかりません" });
      return;
    }

    user.restaurantId = user.restaurantId?.filter(
      (id) => id.toString() !== restaurantId
    );

    await user.save();

    res.status(200).json({ message: "レストランを削除しました", restaurantId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "deleteRestaurant api エラーです" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("バリデーションエラー", errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const userId = req.user?.id;
  try {
    const { password } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({ message: "ユーザーIDがありません" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "パスワードが間違っています" });
      return;
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "ユーザーが削除されました" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "deleteUser api エラーです" });
  }
};
