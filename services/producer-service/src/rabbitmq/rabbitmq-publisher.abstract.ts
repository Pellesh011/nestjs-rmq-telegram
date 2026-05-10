import {
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { Options } from 'amqplib';



import { RabbitMQConnectionService } from './rabbitmq-connection.service';

import { RabbitMQTopology } from './rabbitmq.types';
import { QueuePublisher } from '../abstracts/queue-publisher-service.abstract';
import { BaseEvent } from '../types/event.interface';

export abstract class RabbitMQPublisher
  implements QueuePublisher {
  protected abstract topology: RabbitMQTopology;

  protected readonly logger = new Logger(
    RabbitMQPublisher.name,
  );

  constructor(
    protected readonly rabbit:
      RabbitMQConnectionService,
  ) { }

  protected getPublishOptions(): Options.Publish {
    return {
      persistent: true,

      mandatory: true,

      contentType: 'application/json',
    };
  }

  async publish<T>( event: BaseEvent<T>, ): Promise<void> {
    const channel = this.rabbit.getChannel();

    const buffer = Buffer.from(
      JSON.stringify(event),
    );

    try {
      await Promise.race([
        new Promise<void>(
          (resolve, reject) => {
            const ok = channel.publish(
              this.topology.exchange,
              this.topology.routingKey,
              buffer,
              this.getPublishOptions(),
              (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve();
              },
            );
            if (!ok) {
              this.logger.warn(
                'RabbitMQ backpressure detected',
              );
            }
          },
        ),

        new Promise<void>((_, reject) =>
          setTimeout(() => {
            reject(
              new Error(
                'Publish timeout',
              ),
            );
          }, 10000),
        ),
      ]);
    } catch (err) {
      this.logger.error(
        `Failed to publish event: ${event.type} correlationId=${event.correlationId}`,
        err instanceof Error
          ? err.stack
          : String(err),
      );

      throw new InternalServerErrorException(
        'Failed to publish event',
      );
    }
  }
}