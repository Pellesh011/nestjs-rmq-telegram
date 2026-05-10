import { Injectable, Logger } from '@nestjs/common';

import { RabbitMQConnectionService } from './rabbitmq-connection.service';

import { RabbitMQTopology } from './rabbitmq.types';

@Injectable()
export class RabbitMQTopologyService {
  private readonly logger = new Logger(
    RabbitMQTopologyService.name,
  );

  constructor(private readonly rabbit: RabbitMQConnectionService) {}

  async registerTopology( topology: RabbitMQTopology ): Promise<void> {
    const channel = this.rabbit.getChannel();

    await channel.assertExchange(
      topology.exchange,
      topology.exchangeType,
      {
        durable: true,
      },
    );

    await channel.assertQueue(
      topology.queue,
      {
        durable: true,

        deadLetterExchange:
          topology.deadLetterExchange,
      },
    );

    await channel.bindQueue(
      topology.queue,
      topology.exchange,
      topology.routingKey,
    );

    this.logger.log(
      `Topology registered: ${topology.exchange}`,
    );
  }
}