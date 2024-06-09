import { count, eq } from 'drizzle-orm';
import { db, reports } from '../../db';
import { PaginationParams, getPagination } from '../../pagination';
import { GetReportsQueryParams } from './dto';

type GetReportsQuery = GetReportsQueryParams['status'];

export async function getReports(
  query: GetReportsQuery,
  pagination: PaginationParams
) {
  const res = await db.query.reports.findMany({
    orderBy: (table, { desc }) => desc(table.createdAt),
    limit: pagination.pageSize,
    offset: pagination.offset,
    ...(query ? { where: eq(reports.status, query) } : {}),
  });

  const [{ value: totalRecords }] = await db
    .select({ value: count() })
    .from(reports)
    .where(query ? eq(reports.status, query) : undefined);

  return {
    data: res,
    pagination: getPagination(pagination, totalRecords),
  };
}

export async function getReportById(id: string) {
  return await db.query.reports.findFirst({
    where: eq(reports.id, id),
  });
}

export async function createReport() {}

export async function updateReport() {}

export async function deleteReport() {}
