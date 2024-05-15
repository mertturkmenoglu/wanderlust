import { clerkMiddleware } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { Env } from "..";
import { db } from "../db";
import { points } from "../db/schema";
import { authorize } from "../middlewares/authorize";
import { getAuth } from "../middlewares/get-auth";
import { createPointSchema } from "./dto/create-point";
import { updatePointSchema } from "./dto/update-point";

const limiter = rateLimiter<Env>({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes).
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => c.get("clerkAuth")?.userId ?? c.env.ip.address,
});

const app = new Hono()
  .use(limiter)
  // Get Point by id
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().min(1),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      const [point] = await db.select().from(points).where(eq(points.id, id));

      if (!point) {
        throw new HTTPException(404, {
          message: "Not found",
        });
      }

      return c.json(
        {
          data: point,
        },
        200
      );
    }
  )
  // Create point
  .post(
    "/",
    clerkMiddleware(),
    getAuth,
    zValidator("json", createPointSchema),
    authorize({ type: "create-point" }),
    async (c) => {
      const dto = c.req.valid("json");

      try {
        const [point] = await db.insert(points).values(dto).returning();
        return c.json(
          {
            data: point,
          },
          201
        );
      } catch (e) {
        throw new HTTPException(500, {
          message: "Something went wrong",
        });
      }
    }
  )
  // Update point
  .patch(
    "/:id",
    clerkMiddleware(),
    getAuth,
    zValidator(
      "param",
      z.object({
        id: z.string().min(1),
      })
    ),
    zValidator("json", updatePointSchema),
    authorize({ type: "update-point" }),
    async (c) => {
      const { id } = c.req.valid("param");
      const dto = c.req.valid("json");

      const [point] = await db
        .update(points)
        .set(dto)
        .where(eq(points.id, id))
        .returning();

      if (!point) {
        throw new HTTPException();
      }

      return c.json(
        {
          data: point,
        },
        200
      );
    }
  )
  // Delete point
  .delete(
    "/:id",
    clerkMiddleware(),
    getAuth,
    zValidator(
      "param",
      z.object({
        id: z.string().min(1).uuid(),
      })
    ),
    authorize({ type: "delete-point" }),
    async (c) => {
      const { id } = c.req.valid("param");

      const [point] = await db
        .delete(points)
        .where(eq(points.id, id))
        .returning();

      if (!point) {
        throw new HTTPException(404, {
          message: "Not found",
        });
      }

      return c.json(
        {
          data: point,
        },
        200
      );
    }
  );

export default app;
