import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// ✅ Create a Redis client instance
export const redis = new Redis(process.env.UPSTASH_REDIS_URL);


    await redis.set("foo", "bar");

