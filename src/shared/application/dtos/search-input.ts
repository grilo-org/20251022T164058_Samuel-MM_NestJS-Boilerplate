export type SortDirection = 'asc' | 'desc';

export type SearchParams = {
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDir?: SortDirection;
};

export type NormalizedSearchParams = {
  page: number;
  pageSize: number;
  sort: string;
  sortDir: SortDirection;
};
