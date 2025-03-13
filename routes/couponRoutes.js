import express from "express";
import Coupon from "../models/Coupon.js";
import couponController from "../controllers/couponController.js";

const couponRouter = express.Router()

couponRouter.get('/claimCoupon',couponController)

// couponRouter.post('/claimCoupon',(req,res)=>{
//     console.log(req.ip);
//     console.log(Date.now());
//     res.send('hello worlddd 12k')
// })

export default couponRouter
