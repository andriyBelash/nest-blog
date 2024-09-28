import { AdminController } from 'src/common/utils/controllers';
import { Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationDto } from 'src/common/filter/paginate.dto';

@AdminController('users')
export class AdminUsersController {
  constructor(private userService: UsersService) {}
  @Get('')
  async getUsers(@Query() pagination: PaginationDto) {
    return this.userService.findAll(pagination);
  }
}
