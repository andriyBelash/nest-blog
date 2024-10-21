import { Module } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Article } from 'src/entities/article.entity';
import { ArticlesService } from '../articles/articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from './profile.service';
import { UsersService } from 'src/modules/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Article])],
  controllers: [ProfileController],
  providers: [JwtService, ConfigService, ProfileService, UsersService, ArticlesService],
  exports: [ProfileService],
})
export class ProfileModule {}
