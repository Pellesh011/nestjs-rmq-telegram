import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RabbitMQModule,
    TelegramModule,
  ],
})
export class AppModule {}