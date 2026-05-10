import { Global, Module } from '@nestjs/common';

import { RabbitMQConnectionService } from './rabbitmq-connection.service';

import { RabbitMQTopologyService } from './rabbitmq-topology.service';
import { RabbitMQBootstrapService } from './rabbitmq-bootstrap.service';

@Global()
@Module({
  providers: [
    RabbitMQConnectionService,
    RabbitMQTopologyService,
    RabbitMQBootstrapService,
    RabbitMQTopologyService
  ],

  exports: [
    RabbitMQConnectionService,
    RabbitMQTopologyService,
    RabbitMQBootstrapService,
    RabbitMQTopologyService
  ],
})
export class RabbitMQModule {}