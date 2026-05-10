import { Module } from '@nestjs/common';

import { RabbitMQConnectionService } from './rabbitmq-connection.service';
import { RabbitMQChannelFactory } from './rabbitmq-channel.factory';
import { RabbitMQTopologyService } from './rabbitmq-topology.service';
import { RabbitMQConsumerRunner } from './rabbitmq-consumer.runner';
import { ConsumerDiscoveryService } from './consumers-discovery.service';
import { RabbitMQBootstrapService } from './rabbitmq-bootstrap.service';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [
    DiscoveryModule,
  ],
  providers: [
    RabbitMQConnectionService,
    RabbitMQChannelFactory,
    RabbitMQTopologyService,
    RabbitMQConsumerRunner,
    ConsumerDiscoveryService,
    RabbitMQBootstrapService,
  ],
  exports: [
    RabbitMQConnectionService,
    RabbitMQBootstrapService,
  ],
})
export class RabbitMQModule { }