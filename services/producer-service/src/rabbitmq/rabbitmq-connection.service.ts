import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import * as amqp from 'amqplib';

import type {
  ConfirmChannel,
  Connection,
} from 'amqplib';

@Injectable()
export class RabbitMQConnectionService
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(
    RabbitMQConnectionService.name,
  );

  private connection: Connection | null = null;

  private channel: ConfirmChannel | null = null;

  private reconnecting = false;

  constructor(
    private readonly configService: ConfigService,
  ) { }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.close();
  }

  getChannel(): ConfirmChannel {
    if (!this.channel) {
      throw new Error(
        'RabbitMQ channel is not initialized',
      );
    }

    return this.channel;
  }

  async connect(): Promise<void> {
    const url =
      this.configService.get<string>(
        'RABBITMQ_URL',
      );

    if (!url) {
      throw new Error(
        'RABBITMQ_URL is not defined',
      );
    }

    this.logger.log(
      'Connecting to RabbitMQ...',
    );

    this.connection = await amqp.connect(url);

    this.connection.on('error', (err) => {
      this.logger.error(
        'RabbitMQ connection error',
        err,
      );
    });

    this.connection.on('close', async () => {
      this.logger.warn(
        'RabbitMQ connection closed',
      );

      this.channel = null;
      this.connection = null;

      await this.reconnect();
    });

    this.channel = await this.connection.createConfirmChannel();

    this.channel.on('error', (err) => {
      this.logger.error(
        'RabbitMQ channel error',
        err,
      );
    });

    this.channel.on('return', (msg) => {
      this.logger.warn(
        `Message returned: ${msg.fields.routingKey}`,
      );
    });

    this.logger.log(
      'RabbitMQ connected',
    );
  }

  private async reconnect(): Promise<void> {
    if (this.reconnecting) {
      return;
    }

    this.reconnecting = true;

    while (!this.connection) {
      try {
        this.logger.log(
          'Reconnecting to RabbitMQ...',
        );

        await this.connect();

        this.logger.log(
          'RabbitMQ reconnected',
        );
      } catch (err) {
        this.logger.error(
          'Reconnect failed',
          err,
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 5000),
        );
      }
    }

    this.reconnecting = false;
  }

  private async close(): Promise<void> {
    this.logger.log(
      'Closing RabbitMQ connection...',
    );

    try {
      await this.channel?.close();
    } catch { }

    try {
      await this.connection?.close();
    } catch { }

    this.channel = null;
    this.connection = null;

    this.logger.log(
      'RabbitMQ connection closed',
    );
  }
}