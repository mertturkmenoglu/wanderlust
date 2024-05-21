import { db, follows, users } from "@/db";
import { getAuth, rateLimiter } from "@/middlewares";

import { clerkMiddleware } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { validateUsername } from "../dto";

export const usersRouter = new Hono()
  .use(rateLimiter())
  // Get me
  .get("/me", clerkMiddleware(), getAuth, async (c) => {
    const user = c.get("user");

    return c.json(
      {
        data: user,
      },
      200
    );
  })
  // Get profile by username
  .get(
    "/:username/profile",
    zValidator("param", validateUsername),
    async (c) => {
      const { username } = c.req.valid("param");

      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username));
        return c.json(
          {
            data: user,
          },
          200
        );
      } catch (e) {
        throw new HTTPException(404, {
          message: "Not found",
        });
      }
    }
  )
  // Follow by username
  .post(
    "/follow/:username",
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
        const [follow] = await db
          .insert(follows)
          .values({
            followerId: user.id,
            followingId: targetUser.id,
          })
          .returning();
        return c.json(
          {
            data: follow,
          },
          201
        );
      } catch (e) {
        throw new HTTPException(400, {
          message: "Already following",
        });
      }
    }
  )
  // Unfollow by username
  .post(
    "/unfollow/:username",
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
        await db
          .delete(follows)
          .where(
            and(
              eq(follows.followerId, user.id),
              eq(follows.followingId, targetUser.id)
            )
          );
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
