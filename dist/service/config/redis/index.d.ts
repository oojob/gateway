import Redis from 'ioredis';
export declare const config: {
    port: number | undefined;
    host: string | undefined;
    password: string | undefined;
} | undefined;
declare const redis: Redis.Redis;
export { redis };
export default redis;
