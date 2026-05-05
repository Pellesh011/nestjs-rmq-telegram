// idempotency.service.ts
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.provider';

type Status = 'processing' | 'done';

@Injectable()
export class IdempotencyService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

 
  private key(eventId: string) {
    return `event:${eventId}`;
  }

  async start(eventId: string, ttl = 3600): Promise<boolean> {
    const res = await this.redis.call(
      'SET',
      this.key(eventId),
      'processing',
      'EX',
      ttl,
      'NX',
    );

    return res === 'OK';
  }

  async isDone(eventId: string): Promise<boolean> {
    const val = await this.redis.get(this.key(eventId));
    return val === 'done';
  }

  async finish(eventId: string, ttl = 86400): Promise<void> {
    await this.redis.set(this.key(eventId), 'done', 'EX', ttl);
  }
}