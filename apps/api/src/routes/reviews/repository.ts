import { and, count, eq, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { Media, db, locations, reviews, users } from '../../db';
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

export async function getReviewsByUsername(
  username: string,
  paginationParams: PaginationParams
) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    throw new HTTPException(404, {
      message: 'User not found',
    });
  }

  const results = await db.query.reviews.findMany({
    where: eq(reviews.userId, user.id),
    orderBy: (table, { desc }) => desc(table.createdAt),
    offset: paginationParams.offset,
    limit: paginationParams.pageSize,
    with: {
      location: true,
      user: true,
    },
  });

  const [{ value: totalRecords }] = await db
    .select({ value: count() })
    .from(reviews)
    .where(eq(reviews.userId, user.id));

  return {
    data: results,
    pagination: getPagination(paginationParams, totalRecords),
  };
}

export async function createReview(userId: string, dto: CreateReviewDto) {
  const location = await db.query.locations.findFirst({
    where: eq(locations.id, dto.locationId),
  });

  if (!location) {
    throw new Error('Location not found');
  }

  const review = await db.transaction(async (tx) => {
    const [result] = await tx
      .insert(reviews)
      .values({
        ...dto,
        media: dto.media ? (dto.media as Media[]) : undefined,
        userId,
        likeCount: 0,
      })
      .returning();

    if (!result) {
      throw new Error('Review not created');
    }

    await tx
      .update(locations)
      .set({
        totalPoints: sql`${locations.totalPoints} + ${dto.rating}`,
        totalVotes: sql`${locations.totalVotes} + 1`,
      })
      .where(eq(locations.id, dto.locationId));

    return result;
  });

  return review;
}

export async function deleteReview(id: string, userId: string) {
  const deleted = await db.transaction(async (tx) => {
    const [result] = await tx
      .delete(reviews)
      .where(and(eq(reviews.id, id), eq(reviews.userId, userId)))
      .returning();

    if (!result) {
      throw new Error('Review not found');
    }

    await tx
      .update(locations)
      .set({
        totalPoints: sql`${locations.totalPoints} - ${result.rating}`,
        totalVotes: sql`${locations.totalVotes} - 1`,
      })
      .where(eq(locations.id, result.locationId));

    return result;
  });

  return deleted;
}
