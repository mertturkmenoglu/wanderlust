import { addresses, db } from "@/db";
import { authorize, getAuth, rateLimiter } from "@/middlewares";
import { validateId } from "@/routes/dto";
import { createAddressSchema, updateAddressSchema } from "./dto";

import { clerkMiddleware } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { eq, ilike, or } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

export const addressesRouter = new Hono()
  .use(rateLimiter())
  // Peek last 25 items
  .get("/peek", async (c) => {
    const results = await db.select().from(addresses).limit(25);

    return c.json(
      {
        data: results,
      },
      200
    );
  })
  // Search address
  .get(
    "/search",
    zValidator(
      "query",
      z.object({
        q: z.string().min(1),
      })
    ),
    async (c) => {
      const { q } = c.req.valid("query");

      const results = await db
        .select()
        .from(addresses)
        .where(
          or(
            ilike(addresses.city, `%${q}%`),
            ilike(addresses.country, `%${q}%`),
            ilike(addresses.state, `%${q}%`),
            ilike(addresses.line1, `%${q}%`),
            ilike(addresses.line2, `%${q}%`)
          )
        )
        .limit(25);

      return c.json(
        {
          data: results,
        },
        200
      );
    }
  )
  // Get address by id
  .get("/:id", zValidator("param", validateId), async (c) => {
    const { id } = c.req.valid("param");

    const [address] = await db
      .select()
      .from(addresses)
      .where(eq(addresses.id, id));

    if (!address) {
      throw new HTTPException(404, {
        message: "Not found",
      });
    }

    return c.json(
      {
        data: address,
      },
      200
    );
  })
  // Create address
  .post(
    "/",
    clerkMiddleware(),
    getAuth,
    zValidator("json", createAddressSchema),
    authorize({ type: "create-address" }),
    async (c) => {
      const dto = c.req.valid("json");

      try {
        const [address] = await db.insert(addresses).values(dto).returning();
        return c.json(
          {
            data: address,
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
  // Update address
  .patch(
    "/:id",
    clerkMiddleware(),
    getAuth,
    zValidator("param", validateId),
    zValidator("json", updateAddressSchema),
    authorize({ type: "update-address" }),
    async (c) => {
      const { id } = c.req.valid("param");
      const dto = c.req.valid("json");

      const [address] = await db
        .update(addresses)
        .set(dto)
        .where(eq(addresses.id, id))
        .returning();

      if (!address) {
        throw new HTTPException(404, {
          message: "Not found",
        });
      }

      return c.json(
        {
          data: address,
        },
        200
      );
    }
  )
  // Delete address
  .delete(
    "/:id",
    clerkMiddleware(),
    getAuth,
    zValidator("param", validateId),
    authorize({ type: "delete-address" }),
    async (c) => {
      const { id } = c.req.valid("param");

      const [address] = await db
        .delete(addresses)
        .where(eq(addresses.id, id))
        .returning();

      if (!address) {
        throw new HTTPException(404, {
          message: "Not found",
        });
      }

      return c.json(
        {
          data: address,
        },
        200
      );
    }
  );
