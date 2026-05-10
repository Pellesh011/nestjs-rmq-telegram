import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { TelegramConsumer } from './telegram-comsumer.service';

@Module({
  imports: [RabbitMQModule],

  providers: [
    TelegramService,
    TelegramConsumer,
  ],

  exports: [
    TelegramService,
  ],
})
export class TelegramModule {}