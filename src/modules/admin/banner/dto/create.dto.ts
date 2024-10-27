import { IsString } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  url: string;
}
