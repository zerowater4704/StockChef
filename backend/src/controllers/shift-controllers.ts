import { Request, Response } from "express";
import Shift from "../model/Shift";

export const requestShifts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { year, month, shifts } = req.body;

    const existingShift = await Shift.findOne({ userId, year, month });
    if (existingShift) {
      res.status(400).json({ message: "既にその月のリクエストがあります。" });
      return;
    }

    const newShifts = new Shift({ userId, year, month, shifts });
    await newShifts.save();

    res.status(200).json({ message: "シフト登録に成功しました。", newShifts });
  } catch (error) {
    res.status(500).json({ message: "requestShifts APIのエラーです", error });
  }
};
