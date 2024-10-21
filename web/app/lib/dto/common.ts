export type Pagination = {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export type ErrorResponse = {
  errors: ErrorDto[];
};

export type ErrorDto = {
  status: string;
  code: string;
  title: string;
  detail: string;
};
