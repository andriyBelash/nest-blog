import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './modules/admin/admin.module';
import { WebModule } from './modules/web/web.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nest',
      entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
      synchronize: false,
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsRun: false,
    }),
    AdminModule,
    WebModule,
    MulterModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
