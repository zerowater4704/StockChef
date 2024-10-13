import { createClient } from "redis";

const redisClient = createClient();

// redisClient.on("error", (err) => console.error("Redis Clientエラー", err));

// (async () => {
//   await redisClient.connect();
// })();

redisClient.on("connect", () => console.log("Connected to Redis!"));
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

export default redisClient;
