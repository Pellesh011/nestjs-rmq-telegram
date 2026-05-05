import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import type { ConfirmChannel, Connection } from 'amqplib';

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
    provide: 'RABBITMQ_CHANNEL',
    inject: ['RABBITMQ_CONNECTION'],
    useFactory: async (conn: Connection): Promise<ConfirmChannel> => {
      const channel = await conn.createConfirmChannel();
      return channel;
    },
  },
];
