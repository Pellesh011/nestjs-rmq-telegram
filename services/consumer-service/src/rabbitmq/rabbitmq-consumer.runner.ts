import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQChannelFactory } from './rabbitmq-channel.factory';
import { RabbitMQTopologyService } from './rabbitmq-topology.service';
import { ConsumerDiscoveryService } from './consumers-discovery.service';

@Injectable()
export class RabbitMQConsumerRunner implements OnModuleInit {
  constructor(
    private readonly channelFactory: RabbitMQChannelFactory,
    private readonly topology: RabbitMQTopologyService,
    private readonly discovery: ConsumerDiscoveryService, 
  ) {}

   async onModuleInit() {
    const channel = await this.channelFactory.createConfirmChannel();

    const consumers = this.discovery.getConsumers();

    for (const consumer of consumers) {
      const config = consumer.config();

      await this.topology.assertTopology(channel, config);

      await channel.consume(config.queue, (msg) =>
        consumer.onMessage(msg, channel),
      );
    }
  }
}