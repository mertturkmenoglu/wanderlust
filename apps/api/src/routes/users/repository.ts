import { and, count, desc, eq, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { db, follows, users } from '../../db';
import { PaginationParams, getPagination } from '../../pagination';
import { UpdateProfileDto } from './dto';

export async function getByUsername(username: string, userId?: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    throw new HTTPException(404, {
      message: 'User not found',
    });
  }

  const isFollowing = userId
    ? (await db.query.follows.findFirst({
        where: and(
          eq(follows.followerId, userId),
          eq(follows.followingId, user.id)
        ),
      })) !== undefined
    : false;

  return {
    data: user,
    metadata: {
      isFollowing,
    },
  };
}

export async function updateProfile(userId: string, dto: UpdateProfileDto) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const [updated] = await db
    .update(users)
    .set({
      bio: dto.bio ?? user.bio,
      pronouns: dto.pronouns ?? user.pronouns,
      website: dto.website ?? user.website,
      phone: dto.phone ?? user.phone,
    })
    .where(eq(users.id, userId))
    .returning();

  return updated;
}

export async function follow(followerId: string, followingId: string) {
  const result = await db.transaction(async (tx) => {
    const [follow] = await tx
      .insert(follows)
      .values({
        followerId,
        followingId,
      })
      .returning();

    await tx
      .update(users)
      .set({
        followingCount: sql`${users.followingCount} + 1`,
      })
      .where(eq(users.id, followerId));

    await tx
      .update(users)
      .set({
        followersCount: sql`${users.followersCount} + 1`,
      })
      .where(eq(users.id, followingId));

    return follow;
  });

  return result;
}

export async function unfollow(followerId: string, followingId: string) {
  await db.transaction(async (tx) => {
    await tx
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      );

    await tx
      .update(users)
      .set({
        followingCount: sql`${users.followingCount} - 1`,
      })
      .where(eq(users.id, followerId));

    await tx
      .update(users)
      .set({
        followersCount: sql`${users.followersCount} - 1`,
      })
      .where(eq(users.id, followingId));
  });
}

export async function makeUserVerified(username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    throw new HTTPException(404, {
      message: 'User not found',
    });
  }

  await db
    .update(users)
    .set({
      isVerified: true,
    })
    .where(eq(users.username, username));

  return true;
}

export async function getFollowers(
  username: string,
  pagination: PaginationParams
) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    throw new HTTPException(404, {
      message: 'User not found',
    });
  }

  const res = await db.query.follows.findMany({
    where: eq(follows.followingId, user.id),
    orderBy: desc(follows.createdAt),
    offset: pagination.offset,
    limit: pagination.pageSize,
    with: {
      follower: true,
    },
  });

  const [{ value: totalRecords }] = await db
    .select({ value: count() })
    .from(follows)
    .where(eq(follows.followingId, user.id));

  return {
    data: res,
    pagination: getPagination(pagination, totalRecords),
  };
}

export async function getFollowing(
  username: string,
  pagination: PaginationParams
) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    throw new HTTPException(404, {
      message: 'User not found',
    });
  }

  const res = await db.query.follows.findMany({
    where: eq(follows.followerId, user.id),
    orderBy: desc(follows.createdAt),
    offset: pagination.offset,
    limit: pagination.pageSize,
    with: {
      following: true,
    },
  });

  const [{ value: totalRecords }] = await db
    .select({ value: count() })
    .from(follows)
    .where(eq(follows.followerId, user.id));

  return {
    data: res,
    pagination: getPagination(pagination, totalRecords),
  };
}
