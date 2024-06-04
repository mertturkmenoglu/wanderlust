import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { cacheRead, cacheTTL, cacheWrite } from '../../cache';
import { categories, db } from '../../db';
import { Env } from '../../start';

const factory = createFactory<Env>();

type TCategory = {
  id: number;
  name: string;
};

const getAll = factory.createHandlers(async (c) => {
  const res = await cacheRead<TCategory[]>('categories');

  if (res) {
    return c.json(
      {
        data: res,
      },
      200
    );
  }

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
