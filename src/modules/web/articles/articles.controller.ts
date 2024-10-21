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
} from '@nestjs/common';
import { WebController } from 'src/common/utils/controllers';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesService } from './articles.service';
import { ProfileService } from '../profile/profile.service';
import { QueryDto } from './dto/query.dto';

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

  @Get('all')
  async getAllArticles(@Query() query: QueryDto) {
    return await this.articlesService.findAll(query);
  }
}
