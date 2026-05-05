import { Module, Global } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { rabbitmqProviders } from './rabbitmq.providers';

@Global()
@Module({
  providers: [RabbitMQService, ...rabbitmqProviders],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
