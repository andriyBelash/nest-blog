import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Article } from 'src/entities/article.entity';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ProfileService } from '../profile/profile.service';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Article, User])],
  controllers: [ArticlesController],
  providers: [JwtService, ConfigService, ArticlesService, ProfileService, UsersService],
})
export class ArticlesModule {}
