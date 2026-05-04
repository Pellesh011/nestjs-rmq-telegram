import { Module } from '@nestjs/common';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
      ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RabbitMQModule
  ],
  controllers: [ProducerController],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class ProducerModule {}