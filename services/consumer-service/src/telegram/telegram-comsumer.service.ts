import { Injectable } from '@nestjs/common';
import { BaseConsumer } from '../abstracts/base-consumer.abstract';
import { TelegramService } from './telegram.service';
import { RabbitConsumer } from '../rabbitmq/rabbitmq-consumer.decorator';

@RabbitConsumer()
@Injectable()
export class TelegramConsumer extends BaseConsumer {
  constructor(private readonly service: TelegramService) {
    super();
  }

  config() {
    return {
      exchange: 'telegram',
      exchangeType: 'direct' as const,
      queue: 'telegram',
      routingKey: 'telegram',
      deadLetterExchange: 'telegram.dlx',
    };
  }

  async handle(event: any) {
    await this.service.process(event);
  }

  async handleError(err: unknown) {
    console.error('[telegram consumer error]', err);
  }
}