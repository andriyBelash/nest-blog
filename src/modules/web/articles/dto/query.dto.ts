import { PaginationDto } from 'src/common/filter/paginate.dto';
import { IsOptional, IsString } from 'class-validator';

export class QueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  status: string;

  @IsOptional()
  @IsString()
  user_id: string;
}
