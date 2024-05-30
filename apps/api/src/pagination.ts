export type PaginationParams = {
  page: number;
  pageSize: number;
  offset: number;
};

export type Pagination = {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export function getPagination(
  params: PaginationParams,
  totalRecords: number
): Pagination {
  const modulo = totalRecords % params.pageSize;
  const carry = modulo > 0 ? 1 : 0;

  const totalPages = Math.floor(totalRecords / params.pageSize) + carry;
  const hasPrevious = params.page > 1;
  const hasNext = params.page < totalPages;

  return {
    page: params.page,
    pageSize: params.pageSize,
    totalRecords,
    totalPages,
    hasPrevious,
    hasNext,
  };
}

export function withOffset(
  params: Pick<PaginationParams, 'page' | 'pageSize'>
): PaginationParams {
  return {
    ...params,
    offset: (params.page - 1) * params.pageSize,
  };
}
