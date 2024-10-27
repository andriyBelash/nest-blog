import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ArticlesModule } from './articles/articles.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [AuthModule, ProfileModule, ArticlesModule, CommonModule],
})
export class WebModule {}
