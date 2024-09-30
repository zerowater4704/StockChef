"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const user_1 = __importDefault(require("./routes/user"));
const categories_1 = __importDefault(require("./routes/categories"));
const Items_1 = __importDefault(require("./routes/Items"));
const owner_1 = __importDefault(require("./routes/owner"));
const app = (0, express_1.default)();
const PORT = 3000;
(0, db_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/owner", owner_1.default);
app.use("/api/user", user_1.default);
app.use("/api/category", categories_1.default);
app.use("/api/item", Items_1.default);
app.listen(PORT, () => {
    console.log("サーバーが起動しました");
});
