export const RABBIT_CONSUMER = 'RABBIT_CONSUMER';

export function RabbitConsumer(): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(RABBIT_CONSUMER, true, target);
  };
}