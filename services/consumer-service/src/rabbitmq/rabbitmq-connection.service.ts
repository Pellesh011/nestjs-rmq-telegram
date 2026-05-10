import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import type { Connection } from 'amqplib';

@Injectable()
export class RabbitMQConnectionService implements OnModuleInit, OnModuleDestroy {
    private connection: Connection | null = null;
    private readonly logger = new Logger(RabbitMQConnectionService.name);

    constructor(private readonly configService: ConfigService) { }

    async connect() {
        const url = this.configService.get<string>('RABBITMQ_URL');
        if (!url) throw new Error('RABBITMQ_URL is not defined');

        this.connection = await amqp.connect(url);

        this.connection.on('error', err => this.logger.error(err));
        this.connection.on('close', () => this.logger.warn('connection closed'));
    }

    onModuleInit() {
        
    }
    getConnection(): Connection {
        if (!this.connection) throw new Error('RabbitMQ not initialized');
        return this.connection;
    }

    async onModuleDestroy() {
        await this.connection?.close();
    }
}