import { getAuth, rateLimiter } from "@/middlewares";
import { Env } from "@/start";
import { clerkMiddleware } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createFactory } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { validateUsername } from "../dto";
import * as repository from "./repository";

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
    const user = await repository.getByUsername(username);

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
    const targetUser = await repository.getByUsername(targetUsername);

    if (!targetUser) {
      throw new HTTPException(404, {
        message: "User not found",
      });
    }

    try {
      const result = await repository.follow(user.id, targetUser.id);

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
    const targetUser = await repository.getByUsername(targetUsername);

    if (!targetUser) {
      throw new HTTPException(404, {
        message: "User not found",
      });
    }

    try {
      await repository.unfollow(user.id, targetUser.id);

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
