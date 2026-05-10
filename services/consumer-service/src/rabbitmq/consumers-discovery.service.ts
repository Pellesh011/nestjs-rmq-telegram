import { Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { RABBIT_CONSUMER } from './rabbitmq-consumer.decorator';

@Injectable()
export class ConsumerDiscoveryService {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  getConsumers(): any[] {
    return this.discovery.getProviders()
      .map(p => p.instance)
      .filter(instance => {
        if (!instance) return false;

        const isConsumer = this.reflector.get(
          RABBIT_CONSUMER,
          instance.constructor,
        );

        return isConsumer === true;
      });
  }
}