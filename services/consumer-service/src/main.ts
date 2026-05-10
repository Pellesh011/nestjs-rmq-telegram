import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitMQBootstrapService } from './rabbitmq/rabbitmq-bootstrap.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bootstrap = app.get(RabbitMQBootstrapService);
  await bootstrap.init();
  await app.init();
}
bootstrap();
