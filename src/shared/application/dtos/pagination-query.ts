export type SortDirection = 'asc' | 'desc';

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDir?: SortDirection;
}
