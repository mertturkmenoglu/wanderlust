import { and, eq, sql } from 'drizzle-orm';
import { db, follows, users } from '../../db';

export async function getByUsername(username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  return user;
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
