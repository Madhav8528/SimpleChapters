import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({
  path : "./.env"
})

const redisClient = createClient({
  url : process.env.REDIS_URL
})

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err)
})


const connectRedis = async () => {
  try {
    await redisClient.connect()
    console.log("Redis connected")
  } catch (err) {
    console.error("Redis connection failed:", err)
  }
}

connectRedis();

export { redisClient };