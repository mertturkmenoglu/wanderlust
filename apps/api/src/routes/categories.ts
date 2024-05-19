import { Hono } from "hono";
import { db } from "../db";
import { categories } from "../db/schema";

const app = new Hono()
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

export default app;
