import { Request, response, Response } from "express";
import User from "../model/User";
import Shift from "../model/Shift";

// 従業員IDをレストランIDで取得するヘルパー関数
const getEmployeesIdsByRestaurant = async (restaurantId: string) => {
  const employees = await User.find({ restaurantId });
  return employees.map((employee) => employee._id);
};

// レストランごとの確定前のシフト取得
export const getAllPendingShift = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { year, month, restaurantId } = req.body;

    if (!restaurantId) {
      res.status(400).json({ message: "レストランIDが指定されていません" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "ユーザーが見つかりません" });
      return;
    }

    if (!user.restaurantId || !user.restaurantId.includes(restaurantId)) {
      res
        .status(403)
        .json({ message: "このレストランのアクセス権がありません。" });
    }

    // レストランに所属する従業員のID取得
    const employeeIds = await getEmployeesIdsByRestaurant(restaurantId);
    const allEmployeeShifts = await Shift.find({
      userId: { $in: employeeIds },
      year,
      month,
    }).populate("userId", "name");

    // 全体の従業員のシフトをループ
    const pendingShifts = allEmployeeShifts.flatMap((shiftDoc) =>
      // 従業員ごとの日別シフトをループ
      shiftDoc.shifts
        .filter((shift) => !shift.confirmed)
        .map((shift) => ({
          date: shift.date,
          startTime: shift.startTime,
          finishTime: shift.finishTime,
          confirmed: shift.confirmed,
          userName: (shiftDoc.userId as any).name, // `userId`に`name`プロパティを追加
        }))
    );

    res.status(200).json({ pendingShifts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "getAllPendingShift apiのエラーです", error });
  }
};

// レストランごとのシフト確定
export const confirmShiftsByRestaurant = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { year, month, restaurantId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "ユーザーが見つかりません" });
      return;
    }

    if (!user.restaurantId || !user.restaurantId.includes(restaurantId)) {
      res.status(403).json({ message: "レストランのアクセス権がありません" });
      return;
    }

    const employeeIds = await getEmployeesIdsByRestaurant(restaurantId);
    const allEmployeeShifts = await Shift.find({
      userId: { $in: employeeIds },
      year,
      month,
    });

    allEmployeeShifts.forEach((shiftDoc) => {
      shiftDoc.shifts.forEach((shift) => {
        if (!shift.confirmed) {
          shift.confirmed = true;
        }
      });
      shiftDoc.save();
    });

    res.status(200).json({ message: "シフト確定されました" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "confirmShiftsByRestaurant apiのエラーです", error });
  }
};

//確定前のシフトを修正
export const updatePendingShift = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { year, month, restaurantId, date, startTime, finishTime } = req.body;

    if (!restaurantId) {
      res.status(400).json({ message: "レストランを見つかりません" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "ユーザーが見つかりません" });
      return;
    }

    if (!user.restaurantId || !user.restaurantId.includes(restaurantId)) {
      res.status(403).json({ message: "レストランのアクセス権がありません" });
      return;
    }

    const employeeIds = await getEmployeesIdsByRestaurant(restaurantId);

    // 指定された年、月の日付のシフトを取得
    const shiftDoc = await Shift.findOne({
      userId: { $in: employeeIds },
      year,
      month,
    });

    if (!shiftDoc) {
      res.status(404).json({ message: "シフトが見つかりません" });
      return;
    }

    // 修正したいシフトを探す
    const shiftToUpdate = shiftDoc.shifts.find((shift) => shift.date === date);

    if (!shiftToUpdate) {
      res
        .status(404)
        .json({ message: "指定された日付のシフトが見つかりません" });
      return;
    }

    if (shiftToUpdate.confirmed) {
      res.status(400).json({ message: "確定されたシフトが修正できません" });
      return;
    }

    shiftToUpdate.startTime = startTime;
    shiftToUpdate.finishTime = finishTime;

    await shiftDoc.save();

    res
      .status(200)
      .json({ message: "シフトを修正しました", shift: shiftToUpdate });
  } catch (error) {
    res
      .status(500)
      .json({ message: "updatePendingShift apiのエラーです", error });
  }
};

// 確定したシフトの取得
export const getAllConfirmedShift = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { year, month, restaurantId } = req.body;

    if (!restaurantId) {
      res.status(400).json({ message: "レストランIDが指定されていません" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "ユーザーが見つかりません" });
      return;
    }

    if (!user.restaurantId || !user.restaurantId.includes(restaurantId)) {
      res
        .status(403)
        .json({ message: "このレストランのアクセス権がありません。" });
    }

    // レストランに所属する従業員のID取得
    const employeeIds = await getEmployeesIdsByRestaurant(restaurantId);
    const allEmployeeShifts = await Shift.find({
      userId: { $in: employeeIds },
      year,
      month,
    }).populate("userId", "name");

    // 全体の従業員のシフトをループ
    const pendingShifts = allEmployeeShifts.flatMap((shiftDoc) =>
      // 従業員ごとの日別シフトをループ
      shiftDoc.shifts
        .filter((shift) => shift.confirmed)
        .map((shift) => ({
          date: shift.date,
          startTime: shift.startTime,
          finishTime: shift.finishTime,
          confirmed: shift.confirmed,
          userName: (shiftDoc.userId as any).name, // `userId`に`name`プロパティを追加
        }))
    );

    res.status(200).json({ pendingShifts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "getAllPendingShift apiのエラーです", error });
  }
};

// シフト削除
export const deleteShift = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { year, month, restaurantId, date } = req.body;

    if (!restaurantId) {
      res.status(400).json({ message: "レストランを見つかりません" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "ユーザーが見つかりません" });
      return;
    }

    if (!user.restaurantId || !user.restaurantId.includes(restaurantId)) {
      res.status(403).json({ message: "レストランのアクセス権がありません" });
      return;
    }

    const employeeIds = await getEmployeesIdsByRestaurant(restaurantId);

    const shiftDoc = await Shift.findOne({
      userId: { $in: employeeIds },
      year,
      month,
    });

    if (!shiftDoc) {
      res.status(404).json({ message: "シフトを見つかりません" });
      return;
    }

    // 指定された日付のシフトを見つける
    const shiftDelete = shiftDoc.shifts.find((shift) => shift.date === date);

    if (!shiftDelete) {
      res.status(400).json({ message: "指定した日のシフトを見つかりません" });
      return;
    }

    if (shiftDelete.confirmed) {
      res.status(400).json({ message: "確定されたシフトが削除できません" });
    }

    // 指定された日のシフトを配列から削除
    shiftDoc.shifts = shiftDoc.shifts.filter((shift) => shift.date !== date);
    await shiftDoc.save();

    res.status(200).json({ message: "シフトを削除しました" });
  } catch (error) {
    res.status(500).json({ message: "deleteShift apiのエラーです", error });
  }
};
