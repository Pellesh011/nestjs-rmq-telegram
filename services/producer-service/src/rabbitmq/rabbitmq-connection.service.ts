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
    Options,
} from 'amqplib';

@Injectable()
export class RabbitMQConnectionService

    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(
        RabbitMQConnectionService.name,
    );

    private connection: Connection | null = null;

    private publishChannel: ConfirmChannel | null = null;

    private readonly exchange = 'events.exchange';

    private readonly exchangeOptions: Options.AssertExchange =
        {
            durable: true,
        };

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
        if (!this.publishChannel) {
            throw new Error(
                'RabbitMQ publish channel is not initialized',
            );
        }

        return this.publishChannel;
    }

    getExchange(): string {
        return this.exchange;
    }

    private async connect(): Promise<void> {
        const url = this.configService.get<string>(
            'RABBITMQ_URL',
        );

        if (!url) {
            throw new Error(
                'RABBITMQ_URL is not defined',
            );
        }

        this.logger.log(
            'connecting to rabbitmq...',
        );

        this.connection = await amqp.connect(url);

        this.connection.on('error', (err) => {
            this.logger.error(
                'rabbitmq connection error',
                err,
            );
        });

        this.connection.on('close', () => {
            this.logger.warn(
                'rabbitmq connection closed',
            );
        });

        this.publishChannel =
            await this.connection.createConfirmChannel();

        this.publishChannel.on('error', (err) => {
            this.logger.error(
                'rabbitmq channel error',
                err,
            );
        });

        this.publishChannel.on('close', () => {
            this.logger.warn(
                'rabbitmq channel closed',
            );
        });

        await this.publishChannel.assertExchange(
            this.exchange,
            'fanout',
            this.exchangeOptions,
        );

        this.logger.log(
            'rabbitmq connected',
        );
    }

    private async close(): Promise<void> {
        this.logger.log(
            'closing rabbitmq connection...',
        );

        if (this.publishChannel) {
            await this.publishChannel.close();

            this.publishChannel = null;
        }

        if (this.connection) {
            await this.connection.close();

            this.connection = null;
        }

        this.logger.log(
            'rabbitmq connection closed',
        );
    }
}