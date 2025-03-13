import app from "./app.js";
import http from "http"
import dotenv from 'dotenv'
import connectDB from "./config/db.js";
dotenv.config()

connectDB()

const server = http.createServer(app)


server.listen(process.env.PORT,()=>{
    console.log(`listening on port ${process.env.PORT}`)
})