import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BannerModule } from './banner/banner.module';

@Module({
  imports: [AuthModule, BannerModule],
})
export class AdminModule {}
