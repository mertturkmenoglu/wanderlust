import { sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { cacheTTL, cacheWrite } from '../../cache';
import { categories, db } from '../../db';
import { checkCache } from '../../middlewares';
import { Env } from '../../start';

const factory = createFactory<Env>();

type TCategory = {
  id: number;
  name: string;
};

const getAll = factory.createHandlers(
  checkCache<TCategory[]>('categories'),
  async (c) => {
    const allCategories = await db.select().from(categories);
    await cacheWrite('categories', allCategories, cacheTTL.categories);

    return c.json(
      {
        data: allCategories,
      },
      200
    );
  }
);

type TCategoryWithCount = Array<{ category: TCategory; count: number }>;

const getAllWithCount = factory.createHandlers(
  checkCache<TCategoryWithCount>('categories-with-count'),
  async (c) => {
    const rawResult = await db.execute(sql`
      WITH
        loc_count AS (
          SELECT
            locations.category_id,
            COUNT(*)
          FROM
            locations
            INNER JOIN categories ON locations.category_id = categories.id
          GROUP BY
            category_id
        )
      SELECT
        *
      FROM
        categories
        INNER JOIN loc_count ON loc_count.category_id = categories.id;
    `);

    const result: TCategoryWithCount = rawResult.rows.map((row) => ({
      category: {
        id: row.category_id as number,
        name: row.name as string,
      },
      count: parseInt(row.count as string),
    }));

    await cacheWrite(
      'categories-with-count',
      result,
      cacheTTL['categories-with-count']
    );

    return c.json(
      {
        data: result,
      },
      200
    );
  }
);

export const categoriesRouter = new Hono()
  .get('/', ...getAll)
  .get('/count', ...getAllWithCount);
