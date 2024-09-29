import {
  Get,
  Query,
  UseGuards,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AdminController } from 'src/common/utils/controllers';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUsers } from './dto/search-users.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@AdminController('users')
export class AdminUsersController {
  constructor(private userService: UsersService) {}
  @Get('')
  @UseGuards(AuthGuard)
  async getUsers(@Query() query: SearchUsers) {
    console.log(query);
    return this.userService.findAll(query);
  }

  @Post('')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: 'image/*' })], fileIsRequired: false }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.createUser(body, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    try {
      return await this.userService.updateUser(id, body, file);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
