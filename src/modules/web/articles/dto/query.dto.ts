import { PaginationDto } from 'src/common/filter/paginate.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ArticleStatus } from 'src/common/types/enum';

export class QueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status: ArticleStatus;

  @IsOptional()
  @IsString()
  user_id: string;
}
