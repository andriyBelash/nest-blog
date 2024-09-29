import { PaginationDto } from '../filter/paginate.dto';
import { PaginationData } from '../types/Shared';

export const paginate = async <T, F>(
  repository: any,
  paginationDto: PaginationDto,
  findOptions?: F,
): Promise<PaginationData<T[]>> => {
  const page = paginationDto.page || 1;
  const per_page = paginationDto.per_page || 10;

  const [items, total] = await repository.findAndCount({
    skip: (page - 1) * per_page,
    take: per_page,
    ...findOptions,
  });

  const meta = {
    total,
    page,
    per_page,
  };

  return {
    data: items,
    meta,
  };
};
