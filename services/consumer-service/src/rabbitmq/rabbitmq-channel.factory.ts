import { Injectable } from '@nestjs/common';
import { RabbitMQConnectionService } from './rabbitmq-connection.service';
import type { ConfirmChannel } from 'amqplib';

@Injectable()
export class RabbitMQChannelFactory {
  constructor(private readonly connection: RabbitMQConnectionService) {}

  async createConfirmChannel(): Promise<ConfirmChannel> {
    const conn = this.connection.getConnection();
    return conn.createConfirmChannel();
  }
}