import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { cacheTTL, cacheWrite } from '../../cache';
import { categories, db } from '../../db';
import { checkCache } from '../../middlewares';
import { Env } from '../../start';

const factory = createFactory<Env>();

const getAll = factory.createHandlers(checkCache('categories'), async (c) => {
  const allCategories = await db.select().from(categories);

  await cacheWrite('categories', allCategories, cacheTTL.categories);

  return c.json(
    {
      data: allCategories,
    },
    200
  );
});

export const categoriesRouter = new Hono().get('/', ...getAll);
