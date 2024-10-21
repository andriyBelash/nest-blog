import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bodyParser: true,
  });

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

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
  app.use(cookieParser());
  app.use(express.json());
  await app.listen(3000);
}
bootstrap();
