// Cliente redis y helpers
// backend/src/cache.js
const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379'
});

redisClient.on('error', (err) => console.error('Redis error', err));

async function cacheGet(key) {
  try {
    return await redisClient.get(key);
  } catch (err) {
    console.error('cacheGet error', err);
    return null;
  }
}

async function cacheSet(key, value, ttlSeconds = 60) {
  try {
    if (ttlSeconds > 0) {
      await redisClient.set(key, value, { EX: ttlSeconds });
    } else {
      await redisClient.set(key, value);
    }
  } catch (err) {
    console.error('cacheSet error', err);
  }
}

async function cacheDel(key) {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error('cacheDel error', err);
  }
}

module.exports = { redisClient, cacheGet, cacheSet, cacheDel };

