import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ConfirmChannel } from 'amqplib';
import { TelegramService } from '../telegram/telegram.service';
import type { BaseEvent } from '../types/event.interface';

@Injectable()
export class NotificationConsumer implements OnModuleInit {
  constructor(
    @Inject('RABBITMQ_CHANNEL')
    private readonly channel: ConfirmChannel,
    private readonly telegram: TelegramService,
  ) {}

  async onModuleInit() {
    const queue = 'notification.queue';

    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      const event: BaseEvent = JSON.parse(msg.content.toString());

      try {
        const text = this.format(event);

        await this.telegram.sendMessage(text);

        this.channel.ack(msg);
      } catch (err) {
        console.error('[notification] error', err);

        // requeue for retry
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