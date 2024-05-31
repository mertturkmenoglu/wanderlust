import { and, count, eq } from 'drizzle-orm';
import { Media, db, reviews } from '../../db';
import { PaginationParams, getPagination } from '../../pagination';
import { CreateReviewDto } from './dto';

export async function getById(id: string) {
  return db.query.reviews.findFirst({
    where: eq(reviews.id, id),
    with: {
      location: {
        with: {
          category: true,
        },
      },
      user: true,
    },
  });
}

export async function getReviewsOfLocation(
  locationId: string,
  paginationParams: PaginationParams
) {
  const results = await db.query.reviews.findMany({
    where: eq(reviews.locationId, locationId),
    orderBy: (table, { desc }) => desc(table.createdAt),
    offset: paginationParams.offset,
    limit: paginationParams.pageSize,
    with: {
      user: true,
    },
  });

  const [{ value: totalRecords }] = await db
    .select({ value: count() })
    .from(reviews)
    .where(eq(reviews.locationId, locationId));

  return {
    data: results,
    pagination: getPagination(paginationParams, totalRecords),
  };
}

export async function createReview(userId: string, dto: CreateReviewDto) {
  const [result] = await db
    .insert(reviews)
    .values({
      ...dto,
      media: dto.media ? (dto.media as Media[]) : undefined,
      userId,
      likeCount: 0,
    })
    .returning();

  return result;
}

export async function deleteReview(id: string, userId: string) {
  const [result] = await db
    .delete(reviews)
    .where(and(eq(reviews.id, id), eq(reviews.userId, userId)))
    .returning();

  return result;
}
