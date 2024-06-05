import { count, eq } from 'drizzle-orm';
import { db, lists } from '../../db';
import { PaginationParams, getPagination } from '../../pagination';
import { CreateListDto } from './dto';

export function getById(id: string) {
  return db.query.lists.findFirst({
    where: eq(lists.id, id),
    with: {
      user: true,
      items: true,
    },
  });
}

export async function create(userId: string, dto: CreateListDto) {
  const [list] = await db
    .insert(lists)
    .values({
      ...dto,
      userId,
    })
    .returning();

  return list;
}

export async function getMyLists(userId: string, pagination: PaginationParams) {
  const res = await db.query.lists.findMany({
    where: eq(lists.userId, userId),
    offset: pagination.offset,
    limit: pagination.pageSize,
    orderBy: (table, { desc }) => desc(table.createdAt),
  });

  const [{ value: totalRecords }] = await db
    .select({ value: count() })
    .from(lists)
    .where(eq(lists.userId, userId));

  return {
    data: res,
    pagination: getPagination(pagination, totalRecords),
  };
}
