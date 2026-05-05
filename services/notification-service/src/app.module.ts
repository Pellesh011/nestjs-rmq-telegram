import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { NotificationConsumer } from './consumer/notification.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';
import { RedisProvider } from './redis/redis.provider';
import { IdempotencyService } from './redis/idempotency.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RabbitMQModule,
    TelegramModule,
  ],
  providers: [NotificationConsumer, RedisProvider, IdempotencyService],
})
export class AppModule {}
