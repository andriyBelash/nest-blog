import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Banner } from 'src/entities/banner.entity';
import { Repository } from 'typeorm';
import { CreateBannerDto } from './dto/create.dto';
import { getFileUrl } from 'src/common/utils/functions';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BannerService {
  private APP_URL: string;
  constructor(
    @InjectRepository(Banner)
    private bannersRepository: Repository<Banner>,
    private configService: ConfigService,
  ) {
    this.APP_URL = this.configService.get('APP_URL');
  }

  async createBanner(data: CreateBannerDto, file: Express.Multer.File) {
    const banner = await this.bannersRepository.save({
      ...data,
      logo: await getFileUrl(file, this.APP_URL, 'banner'),
    });
    return banner;
  }

  async updateBanner(id: number, data: CreateBannerDto, file: Express.Multer.File) {
    const banner = await this.bannersRepository.findOne({ where: { id } });
    if (!banner) throw new Error('Banner not found');
    if (file) {
      banner.logo = await getFileUrl(file, this.APP_URL, 'banner');
    }
    this.bannersRepository.merge(banner, data);
    const results = await this.bannersRepository.save(banner);
    return results;
  }

  async deleteBanner(id: number) {
    const banner = await this.bannersRepository.findOne({ where: { id } });
    if (!banner) throw new Error('Banner not found');
    return await this.bannersRepository.remove(banner);
  }

  async findAll() {
    return await this.bannersRepository.find();
  }

  async findOne(id: number) {
    const banner = await this.bannersRepository.findOne({ where: { id } });
    if (!banner) throw new Error('Banner not found');
    return banner;
  }
}
