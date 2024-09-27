import { Body, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminController } from 'src/common/utils/controllers';
import { LoginDto } from './dto/login';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import type { Login } from 'src/common/types/Auth';

@AdminController('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() credentials: LoginDto): Promise<any> {
    const user = await this.authService.validateUser(credentials as Login);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
