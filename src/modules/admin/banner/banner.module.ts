import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { Banner } from 'src/entities/banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Banner])],
  controllers: [BannerController],
  providers: [JwtService, ConfigService, BannerService],
  exports: [BannerService],
})
export class BannerModule {}
