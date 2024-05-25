import { db, follows, users } from "@/db";
import { getAuth, rateLimiter } from "@/middlewares";
import { Env } from "@/start";
import { clerkMiddleware } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { createFactory } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { validateUsername } from "../dto";

const factory = createFactory<Env>();

const getMe = factory.createHandlers(clerkMiddleware(), getAuth, async (c) => {
  const user = c.get("user");

  return c.json(
    {
      data: user,
    },
    200
  );
});

const getProfileByUsername = factory.createHandlers(
  zValidator("param", validateUsername),
  async (c) => {
    const { username } = c.req.valid("param");
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!user) {
      throw new HTTPException(404, {
        message: "Not found",
      });
    }

    return c.json(
      {
        data: user,
      },
      200
    );
  }
);

const follow = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator("param", validateUsername),
  async (c) => {
    const { username: targetUsername } = c.req.valid("param");
    const user = c.get("user");

    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, targetUsername));

    if (!targetUser) {
      throw new HTTPException(404, {
        message: "User not found",
      });
    }

    try {
      const result = await db.transaction(async (tx) => {
        const [follow] = await tx
          .insert(follows)
          .values({
            followerId: user.id,
            followingId: targetUser.id,
          })
          .returning();

        await tx
          .update(users)
          .set({
            followingCount: sql`${users.followingCount} + 1`,
          })
          .where(eq(users.id, user.id));

        await tx
          .update(users)
          .set({
            followersCount: sql`${users.followersCount} + 1`,
          })
          .where(eq(users.id, targetUser.id));

        return follow;
      });

      return c.json(
        {
          data: result,
        },
        201
      );
    } catch (e) {
      throw new HTTPException(400, {
        message: "Already following",
      });
    }
  }
);

const unfollow = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator("param", validateUsername),
  async (c) => {
    const { username: targetUsername } = c.req.valid("param");
    const user = c.get("user");

    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, targetUsername));

    if (!targetUser) {
      throw new HTTPException(404, {
        message: "User not found",
      });
    }

    try {
      await db.transaction(async (tx) => {
        await tx
          .delete(follows)
          .where(
            and(
              eq(follows.followerId, user.id),
              eq(follows.followingId, targetUser.id)
            )
          );

        await tx
          .update(users)
          .set({
            followingCount: sql`${users.followingCount} - 1`,
          })
          .where(eq(users.id, user.id));

        await tx
          .update(users)
          .set({
            followersCount: sql`${users.followersCount} - 1`,
          })
          .where(eq(users.id, targetUser.id));
      });

      return c.json(
        {
          message: "Unfollowed",
        },
        200
      );
    } catch (e) {
      throw new HTTPException(400, {
        message: "Not following",
      });
    }
  }
);

export const usersRouter = new Hono()
  .use(rateLimiter())
  .get("/me", ...getMe)
  .get("/:username/profile", ...getProfileByUsername)
  .post("/follow/:username", ...follow)
  .post("/unfollow/:username", ...unfollow);
