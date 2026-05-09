import { Injectable, Logger } from '@nestjs/common';
import { BaseEvent } from '../types/event.interface';
import { RabbitMQConnectionService } from './rabbitmq-connection.service';
import { QueuePublisherService } from '../producer/abstracts/queue-service.abstract';

@Injectable()
export class RabbitMQPublisherService extends QueuePublisherService{
  private readonly logger = new Logger(
          RabbitMQPublisherService.name,
      );
  constructor(
    private readonly connectionService: RabbitMQConnectionService,
  ) {
    super()
  }

  async publish(event: BaseEvent): Promise<void> {
    const channel = this.connectionService.getChannel();
    const queue = 'notification.queue';

    const buffer = Buffer.from(JSON.stringify(event));

    await new Promise<void>((resolve, reject) => {
    const res = channel.publish(
      this.connectionService.getExchange(),
      queue,
      buffer,
      {
        persistent: true,
        contentType: 'application/json',
      },
      (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      },
    );
    if (!res) {
      this.logger.warn('RabbitMQ backpressure');
    }
  });
  }

}
