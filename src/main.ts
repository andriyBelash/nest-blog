import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useLogger(['log', 'debug', 'error', 'warn', 'verbose']);
  await app.listen(3000);
}
bootstrap();
