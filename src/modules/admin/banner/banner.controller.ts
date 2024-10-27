import {
  Get,
  Delete,
  Post,
  Patch,
  UseGuards,
  UseInterceptors,
  Body,
  FileTypeValidator,
  ParseFilePipe,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { AdminController } from 'src/common/utils/controllers';
import { BannerService } from './banner.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBannerDto } from './dto/create.dto';

@AdminController('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return await this.bannerService.findAll();
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() body: CreateBannerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.bannerService.createBanner(body, file);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: number,
    @Body() body: CreateBannerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.bannerService.updateBanner(id, body, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number) {
    return await this.bannerService.deleteBanner(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.bannerService.findOne(id);
  }
}
