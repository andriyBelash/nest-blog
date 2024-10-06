import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateArticleDto } from './dto/create-article.dto';
import { JwtService } from '@nestjs/jwt';
import { ArticleStatus } from 'src/common/types/enum';

import { slugify, getFileUrl } from 'src/common/utils/functions';

@Injectable()
export class ArticlesService {
  private APP_URL: string;
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.APP_URL = this.configService.get('APP_URL');
  }

  async createArticle(user_id: number, body: CreateArticleDto, file: Express.Multer.File) {
    const slug = slugify(body.title);
    const logo = await getFileUrl(file, this.APP_URL, 'articles');
    const article = await this.articlesRepository.save({
      ...body,
      user_id: user_id,
      status: ArticleStatus.PUBLISHED,
      slug,
      logo,
    });
    return article;
  }
}
