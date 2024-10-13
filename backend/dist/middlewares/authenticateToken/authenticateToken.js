"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdminOrManger = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redisClient_1 = __importDefault(require("../../redis/redisClient"));
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "トークンがありません" });
        return;
    }
    const isBlackListed = yield redisClient_1.default.get(token);
    if (isBlackListed) {
        res.status(403).json({ message: "無効なトークンです" });
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.status(403).json({ message: "トークンが無効です" });
            return;
        }
        req.user = user;
        next();
    });
});
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
