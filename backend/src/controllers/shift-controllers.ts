import { Request, Response } from "express";
import shift from "../model/Shift";

export const requestShift = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, shiftDate, shiftTime } = req.body;
    const existingShift = await shift.findOne({ userId, shiftDate });

    if (existingShift && existingShift.confirmedShift) {
      res.status(400).json({ error: "既に確定されたシフトがあります。" });
      return;
    }

    if (existingShift) {
      res.status(400).json({ error: "既にシフト希望が出されています。" });
      return;
    }

    const newShift = new shift({ userId, shiftDate, shiftTime });

    await newShift.save();

    res
      .status(200)
      .json({ message: "シフトリクエストが送信されました", newShift });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "requestShift APIで失敗しました。" });
  }
};

export const getShifts = async (req: Request, res: Response): Promise<void> => {
  try {
    const shifts = await shift.find().populate("userId", "name");

    res.status(200).json({ shifts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "getShifts APIで失敗しました。" });
  }
};

export const updateShift = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { shiftDate, shiftTime } = req.body;

    const updateTime = await shift.findOneAndUpdate(
      { userId, shiftDate },
      { shiftTime },
      { new: true }
    );

    if (!updateTime) {
      res.status(404).json({ message: "シフトが見つかりません" });
      return;
    }

    await updateTime.save();
    res.status(200).json({ message: "シフトが更新されました", updateTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "updateShift APIで失敗しました。" });
  }
};

export const deleteShift = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;

    if (!userId) {
      res.status(400).json({ message: "ユーザーが見つかりません" });
      return;
    }

    await shift.findByIdAndDelete(userId);

    res.status(200).json({ message: "シフトが削除されました" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "deleteShift APIで失敗しました。" });
  }
};

export const confirmShift = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, shiftDate, confirmedShift } = req.body;

    const shiftConfirm = await shift.findOne({ userId, shiftDate });

    if (!shiftConfirm) {
      res.status(400).json({ message: "シフトが見つかりません" });
      return;
    }

    shiftConfirm.confirmedShift = confirmedShift;
    await shiftConfirm.save();

    res.status(200).json({ message: "シフトが確定されました", shiftConfirm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "confirmShift APIで失敗しました。" });
  }
};
