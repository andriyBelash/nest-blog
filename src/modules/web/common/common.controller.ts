import { WebController } from 'src/common/utils/controllers';
import { BannerService } from 'src/modules/admin/banner/banner.service';
import { Get } from '@nestjs/common';

@WebController('common')
export class CommonController {
  constructor(private readonly bannerService: BannerService) {}

  @Get('banners')
  findAll() {
    return this.bannerService.findAll();
  }
}
