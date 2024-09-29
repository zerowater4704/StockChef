"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdminOrManger = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "トークンがありません" });
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "トークンが無効です" });
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
const authorizeAdminOrManger = (req, res, next) => {
    if (req.user && (req.user.role == "admin" || req.user.role == "manager")) {
        next();
    }
    else {
        console.log(req.user.role);
        res.status(403).json({ message: "アクセス権限がありません" });
    }
};
exports.authorizeAdminOrManger = authorizeAdminOrManger;
