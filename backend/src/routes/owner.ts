import { Router } from "express";
import {
  deleteOwner,
  deleteRestaurant,
  getEmployeesByRestaurant,
  getRestaurant,
  getRestaurantById,
  ownerLogin,
  registerOwner,
  updateOwner,
  updateRestaurant,
} from "../controllers/owner-controller";
import { check } from "express-validator";
import {
  authenticateToken,
  authorizeAdminOrManger,
} from "../middlewares/authenticateToken/authenticateToken";

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
    check("restaurantName")
      .notEmpty()
      .withMessage("レストラン名を入力してください"),
  ],
  registerOwner
);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("有効なメールアドレスを入力してください"),
    check("password").notEmpty().withMessage("パスワードが間違っています"),
  ],
  ownerLogin
);

// router.get(
//   "/joiningKey",
//   authenticateToken,
//   authorizeAdminOrManger,
//   getJoiningKey
// );

router.put(
  "/updateOwner",
  authenticateToken,
  authorizeAdminOrManger,
  updateOwner
);
router.put(
  "/updateRestaurant",
  authenticateToken,
  authorizeAdminOrManger,
  updateRestaurant
);

router.get(
  "/employee",
  authenticateToken,
  authorizeAdminOrManger,
  getEmployeesByRestaurant
);

router.get(
  "/restaurant/:id",
  authenticateToken,
  authorizeAdminOrManger,
  getRestaurantById
);

router.get(
  "/restaurant",
  authenticateToken,
  authorizeAdminOrManger,
  getRestaurant
);

router.delete(
  "/deleteRestaurant",
  authenticateToken,
  authorizeAdminOrManger,
  deleteRestaurant
);

router.delete(
  "/deleteOwner",
  [
    check("email")
      .isEmail()
      .withMessage("有効なメールアドレスを入力してください"),
    check("password").notEmpty().withMessage("パスワードが間違っています。"),
  ],
  authenticateToken,
  authorizeAdminOrManger,
  deleteOwner
);
export default router;
