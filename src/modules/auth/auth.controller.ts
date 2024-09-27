import { Post } from '@nestjs/common';
import { AdminController } from 'src/common/utils/controllers';

@AdminController('auth')
export class AuthController {
  @Post('login')
  login(): string {
    return 'login route';
  }
}
