"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)();
// redisClient.on("error", (err) => console.error("Redis Clientエラー", err));
// (async () => {
//   await redisClient.connect();
// })();
redisClient.on("connect", () => console.log("Connected to Redis!"));
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();
exports.default = redisClient;
