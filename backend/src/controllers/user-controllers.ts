import User from "../model/User";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("バリデーションエラー", errors.array());
    res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("ユーザーは既に存在します", existingUser);
    res.status(400).json({ message: "ユーザーは既に存在します" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({ name, email, password: hashedPassword, role });

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
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "サーバーエラー" });
  }
};
