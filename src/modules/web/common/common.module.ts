import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonController } from './common.controller';
import { BannerService } from 'src/modules/admin/banner/banner.service';
import { Banner } from 'src/entities/banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Banner])],
  controllers: [CommonController],
  providers: [BannerService],
})
export class CommonModule {}
