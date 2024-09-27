import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: true,
    bodyParser: true,
  });
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useLogger(['log', 'debug', 'error', 'warn', 'verbose']);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
