import type { ConfirmChannel, ConsumeMessage } from 'amqplib';

export abstract class BaseConsumer {
  abstract config(): {
    exchange: string;
    exchangeType: 'direct' | 'fanout' | 'topic';
    queue: string;
    routingKey: string;
    deadLetterExchange?: string;
  };

  abstract handle(event: any): Promise<void>;
  abstract handleError(err: unknown): Promise<void>;

  async onMessage(msg: ConsumeMessage | null, channel: ConfirmChannel) {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());
      await this.handle(event);

      channel.ack(msg);
    } catch (e) {
      await this.handleError(e);
      channel.nack(msg, false, false);
    }
  }
}