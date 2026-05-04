import { Inject, Injectable } from '@nestjs/common';
import type { ConfirmChannel } from 'amqplib';
import { RABBITMQ_CHANNEL, RABBITMQ_EXCHANGE } from './rabbitmq.constants';
import { BaseEvent } from '../types/event.interface'

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject(RABBITMQ_CHANNEL)
    private readonly channel: ConfirmChannel,

    @Inject(RABBITMQ_EXCHANGE)
    private readonly exchange: string,
  ) {}

  publish(event: BaseEvent): void {
    const buffer = Buffer.from(JSON.stringify(event));

    this.channel.publish(this.exchange, '', buffer, {
      persistent: true,
      contentType: 'application/json',
    });
  }

  getChannel(): ConfirmChannel {
    return this.channel;
  }
}