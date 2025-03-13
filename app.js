import express from "express"
import cors from "cors"
import couponRouter from "./routes/couponRoutes.js"
import cookieParser from "cookie-parser"

import redisClient from "../redis/redis.js";
import dotenv from "dotenv"

// Load environment variables
dotenv.config();

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:"https://fairshare-frontend.vercel.app", 
    credentials:true
}))

app.use('/',couponRouter)

app.get('/health', async(req, res) => {
  try {
    await redisClient.ping(); // Ping Redis to ensure it's active
    res.status(200).json({ status: "ok", redis: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", redis: "disconnected" });
  }
  });

export default app;