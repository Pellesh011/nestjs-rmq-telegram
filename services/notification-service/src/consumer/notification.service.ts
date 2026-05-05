import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ConfirmChannel } from 'amqplib';
import { TelegramService } from '../telegram/telegram.service';
import type { BaseEvent } from '../types/event.interface';
import { IdempotencyService } from '../redis/idempotency.service';

@Injectable()
export class NotificationConsumer implements OnModuleInit {
  constructor(
    @Inject('RABBITMQ_CHANNEL')
    private readonly channel: ConfirmChannel,
    private readonly telegram: TelegramService,
    private readonly idempotency: IdempotencyService
  ) {}

  async onModuleInit() {
    const queue = 'notification.queue';

   await this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      const event: BaseEvent = JSON.parse(msg.content.toString());

      try {
        // 1. уже завершено → просто ack
        if (await this.idempotency.isDone(event.id)) {
          this.channel.ack(msg);
          return;
        }

        // 2. пытаемся взять в работу
        const acquired = await this.idempotency.start(event.id);

        if (!acquired) {
          // кто-то уже обрабатывает → ретрай позже
          this.channel.nack(msg, false, true);
          return;
        }

        // 3. обработка
        const text = this.format(event);
        await this.telegram.sendMessage(text);

        // 4. помечаем завершённым
        await this.idempotency.finish(event.id);

        // 5. ack
        this.channel.ack(msg);
      } catch (err) {
        console.error('[notification] error', err);

        this.channel.nack(msg, false, true);
      }
    });
  }

  private format(event: BaseEvent): string {
    return `
📩 <b>Event:</b> ${event.type}
🆔 ID: ${event.id}
🔗 Correlation: ${event.correlationId}
⏰ ${event.createdAt}

📦 Payload:
<code>${JSON.stringify(event.payload, null, 2)}</code>
    `;
  }
}