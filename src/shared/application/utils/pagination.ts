import type { SortDirection } from '../dtos/pagination-query';

export function normalizePaginationQuery(q?: {
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDir?: SortDirection;
}) {
  const sortDir: SortDirection = q?.sortDir ?? 'desc';
  return {
    page: q?.page ?? 1,
    pageSize: q?.pageSize ?? 10,
    sort: q?.sort ?? 'createdAt',
    sortDir,
  };
}

export function buildMeta(total: number, page: number, pageSize: number) {
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  return { total, currentPage: page, lastPage, pageSize } as const;
}
