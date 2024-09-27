import { Body, Post } from '@nestjs/common';
import { AdminController } from 'src/common/utils/controllers';
import { LoginDto } from './dto/login';

@AdminController('auth')
export class AuthController {
  @Post('login')
  login(@Body() credentials: LoginDto): string {
    console.log(credentials);
    return 'login route';
  }
}
