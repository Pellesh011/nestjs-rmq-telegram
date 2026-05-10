import { randomUUID } from 'crypto';
import { QueuePublisher } from './queue-publisher-service.abstract';
import { BaseEvent } from '../types/event.interface';

export abstract class BaseProducerService {
  constructor(protected readonly publisher: QueuePublisher) {}

  async publish<T>(type: string, payload: T): Promise<void> {
    const event: BaseEvent<T> = {
      id: randomUUID(),
      correlationId: randomUUID(),
      createdAt: new Date().toISOString(),
      type,
      payload,
    };

    await this.publisher.publish(event);
  }
}