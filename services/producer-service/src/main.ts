import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RabbitMQBootstrapService } from './rabbitmq/rabbitmq-bootstrap.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bootstrap = app.get(RabbitMQBootstrapService);
  await bootstrap.init();
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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет лишние поля
      forbidNonWhitelisted: true, // ошибка если есть лишние поля
      transform: true, // автоматически приводит типы
    }),
  );
  const port = process.env.PORT || 3000;
  await app.listen(port);

  const url = await app.getUrl();
  console.log(`Application is running on: ${url}`);
  console.log(`Swagger UI: ${url}/api-docs`);
}

bootstrap();
