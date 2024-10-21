import { Body, Post, HttpCode, HttpStatus, Res, Req, HttpException } from '@nestjs/common';
import { WebController } from 'src/common/utils/controllers';
import { LoginDto } from './dto/login';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register';
import type { Login, LoginResponse } from 'src/common/types/Auth';
import type { Response, Request } from 'express';

@WebController('auth')
export class AuthWebController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() credentials: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Partial<LoginResponse>> {
    const user = await this.authService.validateUser(credentials as Login);
    if (!user) {
      throw new UnauthorizedException('invalid_credentials');
    }
    const tokens = await this.authService.login(user);

    this.authService.addRefreshTokenToResponse(res, tokens.refresh_token);
    return {
      access_token: tokens.access_token,
      user: user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const refreshToken = req.cookies['refresh_token'] || null;
    console.log(refreshToken);
    if (!refreshToken) {
      throw new HttpException('Рефреш токен не отримано', HttpStatus.BAD_REQUEST);
    }
    if (!refreshToken) {
      new HttpException('Рефреш токен не отримано', HttpStatus.BAD_GATEWAY);
      return;
    }
    const tokens = await this.authService.refreshTokens(refreshToken);
    this.authService.addRefreshTokenToResponse(res, tokens.refresh_token);
    return {
      access_token: tokens.access_token,
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async registeredUser(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const response = await this.authService.registerUser(body);

    this.authService.addRefreshTokenToResponse(res, response.refresh_token);

    return {
      access_token: response.access_token,
      user: response.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res);
    return true;
  }
}
