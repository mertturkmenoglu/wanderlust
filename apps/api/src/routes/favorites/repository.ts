import { and, count, eq } from 'drizzle-orm';
import { db, favorites } from '../../db';
import { PaginationParams, getPagination } from '../../pagination';

export async function getUserFavorites(
  userId: string,
  pagination: PaginationParams
) {
  const res = await db.query.favorites.findMany({
    where: eq(favorites.userId, userId),
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
    .from(favorites)
    .where(eq(favorites.userId, userId));

  return {
    data: res,
    pagination: getPagination(pagination, totalRecords),
  };
}

export async function isFavorite(userId: string, locationId: string) {
  const res = await db.query.favorites.findFirst({
    where: and(
      eq(favorites.userId, userId),
      eq(favorites.locationId, locationId)
    ),
  });

  return res !== undefined;
}

export async function createFavorite(userId: string, locationId: string) {
  const [res] = await db
    .insert(favorites)
    .values({
      userId,
      locationId,
    })
    .returning();

  return res;
}

export async function deleteFavorite(userId: string, locationId: string) {
  await db
    .delete(favorites)
    .where(
      and(eq(favorites.userId, userId), eq(favorites.locationId, locationId))
    );
}
