import { clerkMiddleware } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { Env } from "..";
import { db } from "../db";
import { events } from "../db/schema";
import { authorize } from "../middlewares/authorize";
import { getAuth } from "../middlewares/get-auth";
import { createEventSchema } from "./dto/create-event";
import { updateEventSchema } from "./dto/update-event";

const limiter = rateLimiter<Env>({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes).
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => c.get("clerkAuth")?.userId ?? c.env.ip.address,
});

const app = new Hono()
  .use(limiter)
  // Get event by id
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

      const [event] = await db.select().from(events).where(eq(events.id, id));

      if (!location) {
        throw new HTTPException(404, {
          message: "Not found",
        });
      }

      return c.json(
        {
          data: event,
        },
        200
      );
    }
  )
  // Create event
  .post(
    "/",
    clerkMiddleware(),
    getAuth,
    zValidator("json", createEventSchema),
    authorize({ type: "create-event" }),
    async (c) => {
      const dto = c.req.valid("json");

      try {
        const [event] = await db.insert(events).values(dto).returning();
        return c.json(
          {
            data: event,
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
  // Update event
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
    zValidator("json", updateEventSchema),
    authorize({ type: "update-event" }),
    async (c) => {
      const { id } = c.req.valid("param");
      const dto = c.req.valid("json");

      const [event] = await db
        .update(events)
        .set(dto)
        .where(eq(events.id, id))
        .returning();

      if (!location) {
        throw new HTTPException();
      }

      return c.json(
        {
          data: event,
        },
        200
      );
    }
  )
  // Delete event
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
    authorize({ type: "delete-event" }),
    async (c) => {
      const { id } = c.req.valid("param");

      const [event] = await db
        .delete(events)
        .where(eq(events.id, id))
        .returning();

      if (!location) {
        throw new HTTPException(404, {
          message: "Not found",
        });
      }

      return c.json(
        {
          data: event,
        },
        200
      );
    }
  );

export default app;
