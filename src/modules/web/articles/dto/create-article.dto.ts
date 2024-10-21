import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ArticleStatus } from 'src/common/types/enum';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  badge: string;

  @IsString()
  @IsOptional()
  @IsEnum(ArticleStatus)
  status: string;
}
