import { Router } from "express";
import { check } from "express-validator";
import {
  signup,
  login,
  deleteRestaurant,
  deleteUser,
  userLogout,
  refreshAccessToken,
} from "../controllers/user-controllers";
import { authenticateToken } from "../middlewares/authenticateToken/authenticateToken";

const router = Router();

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("有効なメールアドレスを入力してください"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("パスワードは6文字以上で入力してください"),
    check("name").notEmpty().withMessage("名前を入力してください"),
  ],
  signup
);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("有効なメールアドレスを入力してください"),
    check("password").notEmpty().withMessage("パスワードが間違っています。"),
  ],
  login
);

router.post("/userLogout", authenticateToken, userLogout);

router.post("/userToken", refreshAccessToken);

router.delete("/deleteRestaurant", authenticateToken, deleteRestaurant);

router.delete(
  "/deleteUser",
  [
    check("email")
      .isEmail()
      .withMessage("有効なメールアドレスを入力してください"),
    check("password").notEmpty().withMessage("パスワードが間違っています。"),
  ],
  authenticateToken,
  deleteUser
);
export default router;
