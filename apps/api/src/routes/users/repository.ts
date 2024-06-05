import { and, eq, sql } from 'drizzle-orm';
import { db, follows, users } from '../../db';
import { UpdateProfileDto } from './dto';

export async function getByUsername(username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  return user;
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
