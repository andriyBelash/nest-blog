import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Login } from 'src/common/types/Auth';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: Login): Promise<any> {
    const user = await this.usersService.findOne(email);
    const validateUser = await bcrypt.compare(password, user.password);
    if (user && validateUser) {
      const { password: _, ...result } = user; // Use underscore to indicate unused variable
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
