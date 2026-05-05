import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ConfirmChannel, Message } from 'amqplib';
import { TelegramService } from '../telegram/telegram.service';
import type { BaseEvent } from '../types/event.interface';
import { IdempotencyService } from '../redis/idempotency.service';

@Injectable()
export class NotificationConsumer implements OnModuleInit {
  constructor(
    @Inject('RABBITMQ_CHANNEL')
    private readonly channel: ConfirmChannel,
    private readonly telegram: TelegramService,
    private readonly idempotency: IdempotencyService,
  ) {}

  async onModuleInit() {
    const queue = 'notification.queue';

    await this.channel.consume(queue, (msg: Message | null) => {
      void this.handleMessage(msg);
    });
  }

  private async handleMessage(msg: Message | null): Promise<void> {
    if (!msg) return;

    let event: BaseEvent;

    try {
      event = JSON.parse(msg.content.toString()) as BaseEvent;
    } catch (err) {
      console.error('[notification] invalid JSON', err);
      this.channel.nack(msg, false, false); // в DLQ или drop
      return;
    }

    try {
      // 1. already done
      if (await this.idempotency.isDone(event.id)) {
        this.channel.ack(msg);
        return;
      }

      // 2. acquire lock
      const acquired = await this.idempotency.start(event.id);

      if (!acquired) {
        this.channel.nack(msg, false, true);
        return;
      }

      // 3. process
      const text = this.format(event);
      try {
        await this.telegram.sendMessage(text);
      } catch (err: unknown) {
        // delete event from redis
        await this.idempotency.rollback(event.id);
        this.telegram.handleError(err);
        return
      }
      // 4. finish
      await this.idempotency.finish(event.id);

      this.channel.ack(msg);
    } catch (err) {
      console.error('[notification] error', err);
      this.channel.nack(msg, false, true);
    }
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
