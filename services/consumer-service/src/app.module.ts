import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { RedisProvider } from './redis/redis.provider';
import { IdempotencyService } from './redis/idempotency.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TelegramModule,
  ],

  providers: [
    RedisProvider,
    IdempotencyService,
  ],
})
export class AppModule {}