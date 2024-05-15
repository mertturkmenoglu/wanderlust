import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import { getAuth } from "../middlewares/get-auth";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";

const app = new Hono()
  .get("/me", clerkMiddleware(), getAuth, async (c) => {
    const auth = c.get("auth");

    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, auth.userId));

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
  })
  .get(
    "/:username/profile",
    zValidator(
      "param",
      z.object({
        username: z.string().min(1),
      })
    ),
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
  );

export default app;
