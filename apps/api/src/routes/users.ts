import { clerkMiddleware } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { Env } from "..";
import { db } from "../db";
import { users } from "../db/schema";
import { getAuth } from "../middlewares/get-auth";

const limiter = rateLimiter<Env>({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes).
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => c.get("clerkAuth")?.userId ?? c.env.ip.address,
});

const app = new Hono()
  .use(limiter)
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
