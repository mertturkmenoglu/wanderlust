import { categories, db } from "@/db";

import { Hono } from "hono";

export const categoriesRouter = new Hono()
  // Get all categories
  .get("/", async (c) => {
    const allCategories = await db.select().from(categories);

    return c.json(
      {
        data: allCategories,
      },
      200
    );
  });
