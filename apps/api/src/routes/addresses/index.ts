import { addresses, db } from "@/db";
import { authorize, getAuth, rateLimiter } from "@/middlewares";
import { validateId } from "@/routes/dto";
import { Env } from "@/start";
import { createAddressSchema, updateAddressSchema } from "./dto";

import { clerkMiddleware } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { eq, ilike, or } from "drizzle-orm";
import { Hono } from "hono";
import { createFactory } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const factory = createFactory<Env>();

const peekAddresses = factory.createHandlers(async (c) => {
  const results = await db.select().from(addresses).limit(25);

  return c.json(
    {
      data: results,
    },
    200
  );
});

const search = factory.createHandlers(
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
);

const getById = factory.createHandlers(
  zValidator("param", validateId),
  async (c) => {
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
  }
);

const create = factory.createHandlers(
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
);

const update = factory.createHandlers(
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
);

const deleteAddress = factory.createHandlers(
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

export const addressesRouter = new Hono()
  .use(rateLimiter())
  .get("/peek", ...peekAddresses)
  .get("/search", ...search)
  .get("/:id", ...getById)
  .post("/", ...create)
  .patch("/:id", ...update)
  .delete("/:id", ...deleteAddress);