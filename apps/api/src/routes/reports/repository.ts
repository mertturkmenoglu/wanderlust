import { count, eq } from 'drizzle-orm';
import { db, reports } from '../../db';
import { PaginationParams, getPagination } from '../../pagination';
import { CreateReportDto, GetReportsQueryParams, UpdateReportDto } from './dto';

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

export async function createReport(userId: string, dto: CreateReportDto) {
  const [report] = await db
    .insert(reports)
    .values({
      ...dto,
      reporterId: userId,
    })
    .returning();

  return report;
}

export async function updateReport(id: string, dto: UpdateReportDto) {
  const [updated] = await db
    .update(reports)
    .set({
      ...dto,
    })
    .where(eq(reports.id, id))
    .returning();

  return updated;
}

export async function deleteReport(id: string) {
  const [deleted] = await db
    .delete(reports)
    .where(eq(reports.id, id))
    .returning();

  return deleted;
}
