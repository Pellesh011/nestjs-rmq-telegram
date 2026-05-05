// redis.provider.ts
import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

    client.on('error', (err) => {
      console.error('Redis error', err);
    });

    return client;
  },
};