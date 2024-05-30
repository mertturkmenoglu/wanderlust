import { and, count, eq } from 'drizzle-orm';
import { bookmarks, db } from '../../db';
import { PaginationParams, getPagination } from '../../pagination';

export async function getUserBookmarks(
  userId: string,
  pagination: PaginationParams
) {
  const res = await db.query.bookmarks.findMany({
    where: eq(bookmarks.userId, userId),
    with: {
      location: {
        with: {
          category: true,
        },
      },
    },
    offset: pagination.offset,
    limit: pagination.pageSize,
    orderBy: (table, { desc }) => desc(table.createdAt),
  });

  const [{ value: totalRecords }] = await db
    .select({ value: count() })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId));

  return {
    data: res,
    pagination: getPagination(pagination, totalRecords),
  };
}

export async function isBookmarked(userId: string, locationId: string) {
  const res = await db.query.bookmarks.findFirst({
    where: and(
      eq(bookmarks.userId, userId),
      eq(bookmarks.locationId, locationId)
    ),
  });

  return res !== undefined;
}

export async function createBookmark(userId: string, locationId: string) {
  const [res] = await db
    .insert(bookmarks)
    .values({
      userId,
      locationId,
    })
    .returning();

  return res;
}

export async function deleteBookmark(userId: string, locationId: string) {
  await db
    .delete(bookmarks)
    .where(
      and(eq(bookmarks.userId, userId), eq(bookmarks.locationId, locationId))
    );
}
