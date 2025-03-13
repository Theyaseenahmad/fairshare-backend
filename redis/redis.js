import redis from 'redis'
import dotenv from 'dotenv'

dotenv.config()

console.log('url',process.env.REDIS_URL);
console.log('password',process.env.REDIS_PASSWORD);


const redisClient = await redis.createClient({
  url: `${process.env.REDIS_URL}`,
  password: process.env.REDIS_PASSWORD, // Password for authentication
});

redisClient.on('error', (err) => console.log('Redis Error:', err));
await redisClient.connect();

export default redisClient