import * as amqp from 'amqplib';
import type { ConfirmChannel, Connection } from 'amqplib';
import { RABBITMQ_CHANNEL, RABBITMQ_EXCHANGE } from './rabbitmq.constants';

export const rabbitmqProviders = [
  {
    provide: 'RABBITMQ_CONNECTION',
    useFactory: async (): Promise<Connection> => {
      return amqp.connect(process.env.RABBITMQ_URL!);
    },
  },

  {
    provide: RABBITMQ_CHANNEL,
    inject: ['RABBITMQ_CONNECTION'],
    useFactory: async (conn: Connection): Promise<ConfirmChannel> => {
      return (conn as any).createConfirmChannel();
    },
  },

  {
    provide: RABBITMQ_EXCHANGE,
    inject: [RABBITMQ_CHANNEL],
    useFactory: async (channel: ConfirmChannel) => {
      const exchange = 'events.exchange';

      await channel.assertExchange(exchange, 'fanout', {
        durable: true,
      });

      return exchange;
    },
  },
];