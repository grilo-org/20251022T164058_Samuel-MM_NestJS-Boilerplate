export type PaginationMeta = {
  total: number;
  currentPage: number;
  lastPage: number;
  pageSize: number;
};

export type PaginationOutput<T> = {
  data: T[];
  meta: PaginationMeta;
};
