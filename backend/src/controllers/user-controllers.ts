import User from "../model/User";
import Restaurant from "../model/Restaurant";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "../redis/redisClient";

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

  const hashedPassword = await bcrypt.hash(password, 10);
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

    if (user.role !== "employee" && user.role !== "manager") {
      res.status(400).json({
        message: "今のアカウントは従業員のアカウントではありません",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "パスワードが間違っています" });
      return;
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
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

export const userLogout = async (
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
    process.env.REFRESH_TOKEN_SECRET as string,
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
