import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { BaseEvent } from '../types/event.interface';
import { SendEventDto } from './dto/send-event.dto';
import { randomUUID } from 'crypto';
import { QueuePublisherService } from './abstracts/queue-service.abstract';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);

  constructor(private readonly queue: QueuePublisherService) {}

  async publish(dto: SendEventDto) {
    const event: BaseEvent = {
      id: randomUUID(),
      correlationId: randomUUID(),
      createdAt: new Date().toISOString(),
      type: dto.type,
      payload: dto.payload,
    };
    try{
      return await this.queue.publish(event);
    } catch (err){
      this.logger.error(
        `Failed to publish event: ${event.type}`,
        err instanceof Error ? err.stack : String(err),
      );

      throw new InternalServerErrorException(
        'Failed to publish event',
      );
    }
    
  }
}
