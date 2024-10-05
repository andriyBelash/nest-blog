import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import type { Login, TokenResponse } from 'src/common/types/Auth';
import type { User } from 'src/entities/user.entity';
import { Role } from 'src/common/types/enum';
import { RegisterDto } from './dto/register';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser({ email, password }: Login): Promise<any> {
    const user = await this.usersService.findOne(email, true);
    if (!user) {
      return null;
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    if (user && validatePassword) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async validateAdminUser(user: User) {
    return user && user.role === Role.ADMIN;
  }

  async getTokens(user: User): Promise<TokenResponse> {
    const payload = { email: user.email, sub: user.id };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRETE_KEY'),
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_KEY'),
        expiresIn: '7d',
      }),
    ]);
    return { access_token, refresh_token };
  }

  async login(user: User): Promise<TokenResponse> {
    return this.getTokens(user);
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_KEY'),
      });
      const user = await this.usersService.findOne(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return this.getTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async registerUser(body: RegisterDto) {
    await this.usersService.checkUserExistence(body.email, body.username);

    const user = await this.usersService.createUser(body, null);
    const tokens = await this.getTokens(user);
    return {
      ...tokens,
      user,
    };
  }
}
