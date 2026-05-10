import { Module } from '@nestjs/common';

import { ProducerController } from './telegram.controller';

import { TelegramPublisherService } from './telegram.publisher';

import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [ProducerController],
  providers: [
    TelegramPublisherService,
  ],
})
export class TelegramModule {}