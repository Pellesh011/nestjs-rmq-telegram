import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { NotificationConsumer } from './consumer/notification.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RabbitMQModule,
    TelegramModule
  ],
  providers: [NotificationConsumer],
})
export class AppModule {} 