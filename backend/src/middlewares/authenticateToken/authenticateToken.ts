import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "トークンがありません" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "トークンが無効です" });
    }

    req.user = user as JwtPayload;
    next();
  });
};

export const authorizeAdminOrManger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && (req.user.role == "admin" || req.user.role == "manager")) {
    next();
  } else {
    console.log(req.user.role);
    res.status(403).json({ message: "アクセス権限がありません" });
  }
};
