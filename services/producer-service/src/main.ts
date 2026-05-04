import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ProducerModule } from './producer/producer.module';

async function bootstrap() {
  const app = await NestFactory.create(ProducerModule);

  const config = new DocumentBuilder()
    .setTitle('Producer Service API')
    .setDescription('API для публикации событий в RabbitMQ')
    .setVersion('1.0')
    .addTag('producer')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const url = await app.getUrl();
  console.log(`Application is running on: ${url}`);
  console.log(`Swagger UI: ${url}/api-docs`);
}

bootstrap();