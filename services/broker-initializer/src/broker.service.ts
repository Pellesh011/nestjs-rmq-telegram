import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { ConfirmChannel, Connection } from 'amqplib';

@Injectable()
export class BrokerService implements OnModuleInit {
  private readonly logger = new Logger(BrokerService.name);

  private connection!: Connection;
  private channel!: ConfirmChannel;

  private url;
  constructor(private configService: ConfigService) {
    this.url = configService.get<string>('RABBITMQ_URL');
  }

  async onModuleInit() {
    await this.connect();
    await this.setupTopology();

    this.logger.log('RabbitMQ broker initialized');
    process.exit(0); 
  }

  private async connect(): Promise<void> {
    this.connection = await amqp.connect(this.url!);

    this.channel = await this.connection.createConfirmChannel();
  }

  private async setupTopology(): Promise<void> {
    const exchange = 'events.exchange';

    await this.channel.assertExchange(exchange, 'fanout', {
      durable: true,
    });

    await this.channel.assertQueue('notification.queue', { durable: true });

    await this.channel.bindQueue('notification.queue', exchange, '');
  }
}