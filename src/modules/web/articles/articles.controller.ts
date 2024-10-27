import {
  Body,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  Get,
  Req,
  UploadedFile,
  UseGuards,
  Query,
  UseInterceptors,
  Param,
  HttpException,
  HttpStatus,
  Patch,
  Delete,
} from '@nestjs/common';
import { WebController } from 'src/common/utils/controllers';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesService } from './articles.service';
import { ProfileService } from '../profile/profile.service';
import { QueryDto } from './dto/query.dto';
import { ArticleStatus } from 'src/common/types/enum';

@WebController('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly profileService: ProfileService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Req() req: Request,
    @Body() body: CreateArticleDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const token = req.headers['authorization'].split(' ')[1];
    const user = await this.profileService.getProfile(token);
    return await this.articlesService.createArticle(user.id, body, file);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  async updateArticle(
    @Param('id') id: number,
    @Body() body: CreateArticleDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.articlesService.updateArticle(id, body, file);
  }

  @Get('all')
  async getAllArticles(@Query() query: QueryDto) {
    const params = { ...query, status: ArticleStatus.PUBLISHED };
    return await this.articlesService.findAll(params);
  }

  @Get(':slug')
  async getCurrentArticle(@Param('slug') slug: string) {
    const res = await this.articlesService.findOne(slug);
    if (!res) {
      throw new HttpException('Стаття не знайдена', HttpStatus.NOT_FOUND);
    }
    return res;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteArticle(@Param('id') id: number) {
    return await this.articlesService.deleteArticle(id);
  }
}
