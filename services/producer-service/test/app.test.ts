import { Test } from '@nestjs/testing';
import { RabbitMQPublisherService } from '../src/rabbitmq/rabbitmq-publisher.service';
import type { Options } from 'amqplib';
import { RabbitMQConnectionService } from '../src/rabbitmq/rabbitmq-connection.service';
import { ConfigService } from '@nestjs/config';

type PublishFn = (
  exchange: string,
  routingKey: string,
  content: Buffer,
  options?: Options.Publish,
) => boolean;

describe('RabbitMQService', () => {
  let service: RabbitMQPublisherService;

  let channelMock: { publish: jest.MockedFunction<PublishFn>; };

  let connectionServiceMock: { getChannel: jest.MockedFn<PublishFn>; getExchange: jest.MockedFn<PublishFn>; };

  beforeEach(async () => {
    channelMock = {
      publish: jest.fn(),
    };

    connectionServiceMock = {
      getChannel: jest.fn().mockReturnValue(channelMock),
      getExchange: jest.fn().mockReturnValue('test'),
    };

    const module = await Test.createTestingModule({
      providers: [
        RabbitMQPublisherService,
        {
          provide: RabbitMQConnectionService,
          useValue: connectionServiceMock
        },
        ConfigService,
      ],
    }).compile();

    service = module.get(RabbitMQPublisherService);
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

    expect(channelMock.publish).toHaveBeenCalledTimes(1);

    const [exchange, routingKey, buffer, options] = channelMock.publish.mock.calls[0];

    expect(exchange).toBeDefined();
    expect(routingKey).toBeDefined();

    expect(options?.persistent).toBe(true);

    const parsed: typeof event = JSON.parse(buffer.toString());
    expect(parsed).toEqual(event);
  });
});
