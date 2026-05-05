import * as amqp from 'amqplib';
import type { ConfirmChannel, Connection } from 'amqplib';
import { RABBITMQ_CHANNEL, RABBITMQ_EXCHANGE } from './rabbitmq.constants';
import { ConfigService } from '@nestjs/config';

export const rabbitmqProviders = [
  {
    provide: 'RABBITMQ_CONNECTION',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<Connection> => {
      const url = configService.get<string>('RABBITMQ_URL');

      if (!url) {
        throw new Error('RABBITMQ_URL is not defined');
      }

      return await amqp.connect(url);
    },
  },

  {
    provide: RABBITMQ_CHANNEL,
    inject: ['RABBITMQ_CONNECTION'],
    useFactory: async (conn: Connection): Promise<ConfirmChannel> => {
      return await conn.createConfirmChannel();
    },
  },

  {
    provide: RABBITMQ_EXCHANGE,
    inject: [RABBITMQ_CHANNEL],
    useFactory: async (channel: ConfirmChannel): Promise<string> => {
      const exchange = 'events.exchange';

      await channel.assertExchange(exchange, 'fanout', {
        durable: true,
      });

      return exchange;
    },
  },
];
