export interface RabbitMQTopology {
  exchange: string;
  exchangeType: 'direct' | 'topic' | 'fanout';
  queue: string;
  routingKey: string;
  deadLetterExchange?: string;
}