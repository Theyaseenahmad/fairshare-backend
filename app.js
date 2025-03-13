import express from "express"
import cors from "cors"
import couponRouter from "./routes/couponRoutes.js"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:"https://fairshare-frontend.vercel.app",
    credentials:true
}))

app.use('/',couponRouter)

export default app;