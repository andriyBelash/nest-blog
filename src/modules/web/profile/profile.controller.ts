import { WebController } from 'src/common/utils/controllers';
import {
  Get,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  Body,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileService } from './profile.service';
import { ArticlesService } from '../articles/articles.service';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update.dto';
import { UsersService } from 'src/modules/users/users.service';
import { QueryDto } from '../articles/dto/query.dto';

@WebController('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private userService: UsersService,
    private articlesService: ArticlesService,
  ) {}
  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: Request) {
    const token = req.headers['authorization'].split(' ')[1];
    return this.profileService.getProfile(token);
  }

  @Patch('update')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Req() req: Request,
    @Body() body: UpdateUserDto,
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
    return this.userService.updateUser(user.id, body, file);
  }

  @Get('articles')
  @UseGuards(AuthGuard)
  async getArticles(@Req() req: Request, @Query() query: QueryDto) {
    const token = req.headers['authorization'].split(' ')[1];
    const user = await this.profileService.getProfile(token);
    const params = { ...query, user_id: String(user.id) };
    return this.articlesService.findAll(params);
  }
}
