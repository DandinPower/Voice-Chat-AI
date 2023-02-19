require('dotenv').config();  //載入env變數
const redis = require('redis')
const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
const config = {
    url: redisUrl
}
const redisClient = redis.createClient(config)
redisClient.connect()
redisClient.on('connect', () => console.log('Connected to redis server'))
redisClient.on('error', (err) => {
    console.log('ⓘ on error:', err);
})
module.exports = redisClient;