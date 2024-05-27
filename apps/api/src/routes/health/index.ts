import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { Env } from '../../start';

const factory = createFactory<Env>();

const index = factory.createHandlers(async (c) => {
  return c.json(
    {
      message: 'OK',
    },
    200
  );
});

export const healthRouter = new Hono().get('/', ...index);
