import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BannerModule } from './banner/banner.module';
import { CategoriesModule } from './articles_categories/categories.module';

@Module({
  imports: [AuthModule, BannerModule, CategoriesModule],
})
export class AdminModule {}
