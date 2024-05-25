import { Address, db, locations } from "@/db";
import { authorize, getAuth, rateLimiter } from "@/middlewares";
import * as search from "@/search";
import { Env } from "@/start";
import { clerkMiddleware } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { createFactory } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { validateId } from "../dto";
import { createLocationSchema, updateLocationSchema } from "./dto";

const factory = createFactory<Env>();

const peek = factory.createHandlers(async (c) => {
  const results = await db.query.locations.findMany({
    limit: 25,
    with: {
      category: true,
    },
  });

  return c.json(
    {
      data: results,
    },
    200
  );
});

const getById = factory.createHandlers(
  zValidator("param", validateId),
  async (c) => {
    const { id } = c.req.valid("param");

    const location = await db.query.locations.findFirst({
      where: eq(locations.id, id),
      with: {
        category: true,
      },
    });

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

const create = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator("json", createLocationSchema),
  authorize({ type: "create-location" }),
  async (c) => {
    const dto = c.req.valid("json");

    try {
      const [location] = await db
        .insert(locations)
        .values({
          ...dto,
          address: dto.address as Address,
          tags: (dto.tags ?? []) as string[],
        })
        .returning();

      await search.upsertLocation(location);

      return c.json(
        {
          data: location,
        },
        201
      );
    } catch (e) {
      console.log("Error:", e);
      throw new HTTPException(500, {
        message: "Something went wrong",
      });
    }
  }
);

const update = factory.createHandlers(
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
      .set({
        ...dto,
        address: dto.address as Address,
        tags: (dto.tags ?? []) as string[],
      })
      .where(eq(locations.id, id))
      .returning();

    if (!location) {
      throw new HTTPException();
    }

    await search.upsertLocation(location);

    return c.json(
      {
        data: location,
      },
      200
    );
  }
);

const deleteLocation = factory.createHandlers(
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

    await search.deleteLocation(id);

    return c.json(
      {
        data: location,
      },
      200
    );
  }
);

export const locationsRouter = new Hono()
  .use(rateLimiter())
  .get("/peek", ...peek)
  .get("/:id", ...getById)
  .post("/", ...create)
  .patch("/:id", ...update)
  .delete("/:id", ...deleteLocation);
