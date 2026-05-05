// rabbitmq.service.spec.ts
import { Test } from '@nestjs/testing';
import { RabbitMQService } from '../src/rabbitmq/rabbitmq.service'
import { RABBITMQ_CHANNEL, RABBITMQ_EXCHANGE } from '../src/rabbitmq/rabbitmq.constants';
import type { ConfirmChannel } from 'amqplib';

describe('RabbitMQService', () => {
  let service: RabbitMQService;
  let channel: jest.Mocked<ConfirmChannel>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RabbitMQService,
        {
          provide: RABBITMQ_CHANNEL,
          useValue: {
            publish: jest.fn(),
          },
        },
        {
          provide: RABBITMQ_EXCHANGE,
          useValue: 'test.exchange',
        },
      ],
    }).compile();

    service = module.get(RabbitMQService);
    channel = module.get(RABBITMQ_CHANNEL);
  });

  it('should publish event', () => {
    const event = {
      id: '1',
      type: 'test',
      payload: { foo: 'bar' },
      createdAt: new Date().toISOString(),
      correlationId: 'corr-1',
    };

    service.publish(event);

    expect(channel.publish).toHaveBeenCalledTimes(1);

    const call = channel.publish.mock.calls[0];

    expect(call).toBeDefined();

    const [, , buffer, options] = call!;

    expect(options).toBeDefined();
    expect(options!.persistent).toBe(true);

    const parsed = JSON.parse(buffer.toString());
    expect(parsed).toEqual(event);
  });
});