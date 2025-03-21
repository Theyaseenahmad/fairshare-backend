import Coupon from "../models/Coupon.js";
import requestIp from 'request-ip'
import redisClient from "../redis/redis.js";
import dotenv from "dotenv"

dotenv.config()

const couponController = async (req,res)=>{
    console.log(req.ip);
    console.log(Date.now());

    const clientIp = requestIp.getClientIp(req); 
    console.log("clientIp",clientIp);

//     const ip = req.clientIp; // Extracted using request-ip

  const lastClaimRedis = await redisClient.get(`ip:${clientIp}`);
  const lastClaimCookie = req.cookies.last_claim;

  const lastClaimTime = lastClaimRedis || lastClaimCookie;

  console.log("lastClaim",lastClaimRedis);
  console.log("date",Date.now() - lastClaimRedis);

  console.log("t/f",(Date.now() - lastClaimRedis) < 3600000);
  
  if (lastClaimTime && Date.now() - lastClaimTime < 3600000) {
    return res.status(429).json({ 
      error: "Wait 1 hour before claiming again! ⏳",
      retryAfter: 3600 - Math.floor((Date.now() - lastClaimTime)/1000)
    });
  }


  console.log('here');
  
 
  try {
    const coupon = await Coupon.findOne({ isClaimed: false })
    .sort({ createdAt: 1 });

    console.log("coupon",coupon);

    
    if (!coupon) {
      return res.status(404).json({ error: "No coupons left! 😢" });
    }

    coupon.isClaimed = true;
      coupon.claimedAt = new Date();
      await coupon.save();

      await redisClient.set(`ip:${clientIp}`, Date.now(), "EX", 3600);

      res.cookie('last_claim', Date.now(), { 
        maxAge: 3600000, // 1 hour
        secure: true, 
        sameSite: 'none', 
        httpOnly: false, // More secure
      });
      


    res.status(200).json({ coupon });
    
  } catch (error) {
    console.log("error",error);
    return res.status(500).json({error:"database down",error})
    
  }

   

}

export default couponController