import { Test } from '@nestjs/testing';
import { RabbitMQService } from '../src/rabbitmq/rabbitmq.service';
import {
  RABBITMQ_CHANNEL,
  RABBITMQ_EXCHANGE,
} from '../src/rabbitmq/rabbitmq.constants';
import type { Options } from 'amqplib';

type PublishFn = (
  exchange: string,
  routingKey: string,
  content: Buffer,
  options?: Options.Publish,
) => boolean;

describe('RabbitMQService', () => {
  let service: RabbitMQService;

  let publishMock: jest.MockedFunction<PublishFn>;

  beforeEach(async () => {
    publishMock = jest.fn() as jest.MockedFunction<PublishFn>;

    const module = await Test.createTestingModule({
      providers: [
        RabbitMQService,
        {
          provide: RABBITMQ_CHANNEL,
          useValue: {
            publish: publishMock,
          },
        },
        {
          provide: RABBITMQ_EXCHANGE,
          useValue: 'test.exchange',
        },
      ],
    }).compile();

    service = module.get(RabbitMQService);
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

    expect(publishMock).toHaveBeenCalledTimes(1);

    const [exchange, routingKey, buffer, options] = publishMock.mock.calls[0];

    expect(exchange).toBeDefined();
    expect(routingKey).toBeDefined();

    expect(options?.persistent).toBe(true);

    const parsed: typeof event = JSON.parse(buffer.toString());
    expect(parsed).toEqual(event);
  });
});
