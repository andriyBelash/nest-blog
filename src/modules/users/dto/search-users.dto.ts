import { PaginationDto } from 'src/common/filter/paginate.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/common/types/enum';

export class SearchUsers extends PaginationDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
