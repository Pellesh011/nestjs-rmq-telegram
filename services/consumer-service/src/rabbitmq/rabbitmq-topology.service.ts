import { Injectable } from '@nestjs/common';
import type { ConfirmChannel, Options } from 'amqplib';

export interface QueueConfig {
  exchange: string;
  exchangeType: 'direct' | 'fanout' | 'topic';
  queue: string;
  routingKey: string;
  deadLetterExchange?: string;
}

@Injectable()
export class RabbitMQTopologyService {
  async assertTopology(channel: ConfirmChannel, config: QueueConfig) {
    const exchangeOpts: Options.AssertExchange = { durable: true };

    await channel.assertExchange(config.exchange, config.exchangeType, exchangeOpts);

    if (config.deadLetterExchange) {
      await channel.assertExchange(config.deadLetterExchange, 'direct', { durable: true });
    }

    await channel.assertQueue(config.queue, {
      durable: true,
      deadLetterExchange: config.deadLetterExchange,
    });

    await channel.bindQueue(config.queue, config.exchange, config.routingKey);
  }
}