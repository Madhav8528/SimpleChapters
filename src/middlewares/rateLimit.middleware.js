import rateLimit from "express-rate-limit"
import RedisStore from "rate-limit-redis"
import { redisClient } from "../utils/redisClient.js"

export const limiter = rateLimit({
  windowMs: 60 * 1000,         // 1 minute
  max: 30,                     // limit each IP to 30 requests per windowMs
  standardHeaders: true,       
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args)
  })
})