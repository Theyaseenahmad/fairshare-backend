import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
    code : {type: String},
    isClaimed: { type: Boolean, default: false }, 
    claimedAt: { type: Date }, 
    createdAt: { type: Date, default: Date.now }, 
})

const Coupon = mongoose.model('coupon',CouponSchema)

export default Coupon;