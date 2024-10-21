import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Like, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateArticleDto } from './dto/create-article.dto';
import { JwtService } from '@nestjs/jwt';
import { ArticleStatus } from 'src/common/types/enum';

import { slugify, getFileUrl } from 'src/common/utils/functions';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { User } from 'src/entities/user.entity';
import { QueryDto } from './dto/query.dto';

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
    const status = body.status || ArticleStatus.PUBLISHED;
    const article = await this.articlesRepository.save({
      ...body,
      user_id: user_id,
      status: status,
      slug,
      logo,
    });
    return article;
  }

  async findAll(queryDto: QueryDto) {
    const { search, status, user_id } = queryDto;

    const page = queryDto.page || 1;
    const per_page = queryDto.per_page || 10;

    const whereCondition: any = {
      title: search ? Like(`%${search}%`) : undefined,
    };

    whereCondition.status = status ? status : ArticleStatus.PUBLISHED;
    whereCondition.user_id = user_id ? user_id : undefined;

    const [items, total] = await this.articlesRepository.findAndCount({
      skip: (page - 1) * per_page,
      take: per_page,
      order: {
        id: 'DESC',
      },
      where: whereCondition,
      relations: ['user'],
    });

    const articles = items.map((article) => {
      const userInstance = plainToInstance(User, article.user);
      article.user = instanceToPlain(userInstance) as User;
      return article;
    });

    return {
      data: articles,
      meta: { total, page, per_page },
    };
  }
}
