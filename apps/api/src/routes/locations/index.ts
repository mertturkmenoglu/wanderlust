import { clerkMiddleware } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { db, locations } from "@/db";
import { authorize, getAuth, rateLimiter } from "@/middlewares";
import { validateId } from "../dto";
import { createLocationSchema, updateLocationSchema } from "./dto";

export const locationsRouter = new Hono()
  .use(rateLimiter())
  // Peek last 25 items
  .get("/peek", async (c) => {
    const results = await db.select().from(locations).limit(25);

    return c.json(
      {
        data: results,
      },
      200
    );
  })
  // Get Location by id
  .get("/:id", zValidator("param", validateId), async (c) => {
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
  })
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
    zValidator("param", validateId),
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
    zValidator("param", validateId),
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
