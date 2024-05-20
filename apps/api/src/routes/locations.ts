import { clerkMiddleware } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { db } from "../db";
import { locations } from "../db/schema";
import { authorize } from "../middlewares/authorize";
import { getAuth } from "../middlewares/get-auth";
import { Env } from "../runtime";
import { createLocationSchema } from "./dto/create-location";
import { updateLocationSchema } from "./dto/update-location";

const limiter = rateLimiter<Env>({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes).
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => c.get("clerkAuth")?.userId ?? c.env.ip.address,
});

const app = new Hono()
  .use(limiter)
  // Get Location by id
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

      const [location] = await db
        .select()
        .from(locations)
        .where(eq(locations.id, id));

      if (!location) {
        throw new HTTPException(404, {
          message: "Not found",
        });
      }

      return c.json(
        {
          data: location,
        },
        200
      );
    }
  )
  // Create location
  .post(
    "/",
    clerkMiddleware(),
    getAuth,
    zValidator("json", createLocationSchema),
    authorize({ type: "create-location" }),
    async (c) => {
      const dto = c.req.valid("json");

      try {
        const [location] = await db.insert(locations).values(dto).returning();
        return c.json(
          {
            data: location,
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
  // Update location
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
    zValidator("json", updateLocationSchema),
    authorize({ type: "update-location" }),
    async (c) => {
      const { id } = c.req.valid("param");
      const dto = c.req.valid("json");

      const [location] = await db
        .update(locations)
        .set(dto)
        .where(eq(locations.id, id))
        .returning();

      if (!location) {
        throw new HTTPException();
      }

      return c.json(
        {
          data: location,
        },
        200
      );
    }
  )
  // Delete location
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
    authorize({ type: "delete-location" }),
    async (c) => {
      const { id } = c.req.valid("param");

      const [location] = await db
        .delete(locations)
        .where(eq(locations.id, id))
        .returning();

      if (!location) {
        throw new HTTPException(404, {
          message: "Not found",
        });
      }

      return c.json(
        {
          data: location,
        },
        200
      );
    }
  );

export default app;
