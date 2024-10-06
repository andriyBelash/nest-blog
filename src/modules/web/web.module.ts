import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [AuthModule, ProfileModule, ArticlesModule],
})
export class WebModule {}
