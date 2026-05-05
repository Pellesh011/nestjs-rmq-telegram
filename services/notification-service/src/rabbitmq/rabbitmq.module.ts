import { Module } from '@nestjs/common';
import { rabbitmqProviders } from './rabbitmq.providers';

@Module({
  providers: [...rabbitmqProviders],
  exports: [...rabbitmqProviders],
})
export class RabbitMQModule {}
