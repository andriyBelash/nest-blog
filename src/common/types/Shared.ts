export interface PaginationData<T> {
  meta: {
    total: number;
    page: number;
    per_page: number;
  };
  data: T;
}
