import { Body, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminController } from 'src/common/utils/controllers';
import { LoginDto } from './dto/login';
import { RefreshTokenDto } from './dto/refersh';
import { AuthService } from './auth.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import type { Login, LoginResponse } from 'src/common/types/Auth';

@AdminController('auth')
export class AuthAdminController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() credentials: LoginDto): Promise<LoginResponse> {
    const user = await this.authService.validateUser(credentials as Login);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isAdmin = await this.authService.validateAdminUser(user);
    if (!isAdmin) {
      throw new ForbiddenException('Access denied. Admin role required.');
    }
    const tokens = await this.authService.login(user);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() body: RefreshTokenDto) {
    if (!body.token) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshTokens(body.token);
  }
}
