import redis from 'redis'
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_URL}`,
  password: process.env.REDIS_PASSWORD, // Password for authentication
});

redisClient.on('error', (err) => console.log('Redis Error:', err));
await redisClient.connect();

export default redisClient