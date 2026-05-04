import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service'
import { BaseEvent } from '../types/event.interface';
import { SendEventDto } from './dto/send-event.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);

  constructor(private readonly rabbit: RabbitMQService) {}

  publish(dto: SendEventDto) {
      const event: BaseEvent = {
        id: randomUUID(),
        correlationId: randomUUID(),
        createdAt: new Date().toISOString(),
        type: dto.type,
        payload: dto.payload,
      };

      return this.rabbit.publish(event);
    }

}