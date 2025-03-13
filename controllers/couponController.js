import Coupon from "../models/Coupon.js";
import requestIp from 'request-ip'
import redisClient from "../redis/redis.js";
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
  

    const coupon = await Coupon.findOne({ isClaimed: false })
    .sort({ createdAt: 1 });

    if (!coupon) {
        return res.status(404).json({ error: "No coupons left! 😢" });
      }

      coupon.isClaimed = true;
        coupon.claimedAt = new Date();
        await coupon.save();

  await redisClient.set(`ip:${clientIp}`, Date.now(), "EX", 3600);

  res.cookie('last_claim', Date.now(), { 
    maxAge: 3600000, // 1 hour
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict' 
  });


  res.status(200).json({ coupon });
}

export default couponController