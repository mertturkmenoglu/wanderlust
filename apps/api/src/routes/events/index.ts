import { db, events } from "@/db";
import { authorize, getAuth } from "@/middlewares";
import { createEventSchema, updateEventSchema } from "./dto";

import { rateLimiter } from "@/middlewares";
import { clerkMiddleware } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { validateId } from "../dto";

export const eventsRouter = new Hono()
  .use(rateLimiter())
  // Peek last 25 items
  .get("/peek", async (c) => {
    const results = await db.select().from(events).limit(25);

    return c.json(
      {
        data: results,
      },
      200
    );
  })
  // Get event by id
  .get("/:id", zValidator("param", validateId), async (c) => {
    const { id } = c.req.valid("param");

    const [event] = await db.select().from(events).where(eq(events.id, id));

    if (!event) {
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
  })
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
    zValidator("param", validateId),
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
    zValidator("param", validateId),
    authorize({ type: "delete-event" }),
    async (c) => {
      const { id } = c.req.valid("param");

      const [event] = await db
        .delete(events)
        .where(eq(events.id, id))
        .returning();

      if (!event) {
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
