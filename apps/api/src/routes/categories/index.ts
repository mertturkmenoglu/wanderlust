import { categories, db } from "@/db";
import { Env } from "@/start";

import { Hono } from "hono";
import { createFactory } from "hono/factory";

const factory = createFactory<Env>();

const getAll = factory.createHandlers(async (c) => {
  const allCategories = await db.select().from(categories);

  return c.json(
    {
      data: allCategories,
    },
    200
  );
});

export const categoriesRouter = new Hono().get("/", ...getAll);
