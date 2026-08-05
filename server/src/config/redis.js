import { Redis } from '@upstash/redis'
const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.TOKEN,
})

await redis.set("foo", "bar");
await redis.get("foo");

export default redis