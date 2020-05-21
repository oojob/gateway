import Redis from 'ioredis'

const redisConfig = {
	port: process.env.REDIS_CACHE_PORT ? parseInt(process.env.REDIS_CACHE_PORT) : undefined,
	host: process.env.REDIS_CACHE_URL,
	password: process.env.REDIS_CACHE_PASSWORD
}
export const config = process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV ? redisConfig : undefined

const redis = new Redis(config)

export { redis }
export default redis
