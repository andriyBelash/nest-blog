import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
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
  app.useStaticAssets(join(__dirname, '..', 'storage'), {
    prefix: '/storage/',
  });
  await app.listen(3000);
}
bootstrap();
