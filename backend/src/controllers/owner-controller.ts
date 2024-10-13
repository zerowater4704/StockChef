import User from "../model/User";
import Restaurant from "../model/Restaurant";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import redisClient from "../redis/redisClient";

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

    if (owner.role !== "admin") {
      res.status(400).json({
        message: "今のアカウントはオーナーのアカウントではありません",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      res.status(400).json({ message: "パスワードが間違っています" });
      return;
    }

    const accessToken = jwt.sign(
      { id: owner._id, role: owner.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
      { id: owner._id, role: owner.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken, owner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ownerLogin APIで失敗しました。" });
  }
};

export const ownerLogout = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(400).json({ message: "トークンがありません" });
    return;
  }

  await redisClient.set(token, "blacklisted", { EX: 3600 });

  res.status(200).json({ message: "ログアウトしました" });
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(403).json({ message: "リフレッシュトークンがありません" });
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET as string,
    (err: any, user: any) => {
      if (err)
        return res
          .status(403)
          .json({ message: "リフレッシュトークンが無効です" });

      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "10m" }
      );

      res.status(200).json({ accessToken: newAccessToken });
    }
  );
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
