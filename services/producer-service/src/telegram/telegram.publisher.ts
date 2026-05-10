import { Injectable } from '@nestjs/common';

import { RabbitMQPublisher } from '../rabbitmq/rabbitmq-publisher.abstract';

import { RabbitMQConnectionService } from '../rabbitmq/rabbitmq-connection.service';

import { RabbitMQTopology } from '../rabbitmq/rabbitmq.types';
import { RabbitMQTopologyService } from '../rabbitmq/rabbitmq-topology.service';

@Injectable()
export class TelegramPublisherService extends RabbitMQPublisher {
  protected topology: RabbitMQTopology =
    {
      exchange: 'telegram',
      exchangeType: 'direct',
      queue: 'telegram',
      routingKey: 'telegram',
      deadLetterExchange:
        'telegram.dlx',
    };
  constructor(
    rabbit: RabbitMQConnectionService,
    private readonly topologyService: RabbitMQTopologyService ) {
       super(rabbit);
    }

  async onModuleInit(): Promise<void> {
    await this.topologyService.registerTopology(
      this.topology,
    );

    this.logger.log(
      'Telegram topology initialized',
    );
  }

}