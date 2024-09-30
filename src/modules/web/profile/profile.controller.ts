import { WebController } from 'src/common/utils/controllers';
import { Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileService } from './profile.service';
import { Request } from 'express';

@WebController('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: Request) {
    const token = req.headers['authorization'].split(' ')[1];
    return this.profileService.getProfile(token);
  }
}
