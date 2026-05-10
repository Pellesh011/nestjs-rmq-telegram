import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

    client.on('error', (err: Error) => {
      console.error('Redis error', err);
    });

    return client;
  },
};
