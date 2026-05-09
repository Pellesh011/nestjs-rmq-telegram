import { Module, Global } from '@nestjs/common';
import { RabbitMQPublisherService } from './rabbitmq-publisher.service';
import { RabbitMQConnectionService } from './rabbitmq-connection.service';
import { QueuePublisherService } from '../producer/abstracts/queue-service.abstract';

@Global()
@Module({
  providers: [
    RabbitMQPublisherService,
    RabbitMQConnectionService,
    {
      provide: QueuePublisherService,
      useExisting: RabbitMQPublisherService,
    },],
  exports: [RabbitMQPublisherService, RabbitMQConnectionService, QueuePublisherService],
})
export class RabbitMQModule { }
