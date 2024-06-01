import { clerkMiddleware } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { cacheWrite } from '../../cache';
import { getAuth, rateLimiter } from '../../middlewares';
import { Env } from '../../start';
import { minioClient } from '../../upload';
import { getNewUploadUrlSchema } from './dto';

const factory = createFactory<Env>();

const getNewUploadUrl = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('query', getNewUploadUrlSchema),
  async (c) => {
    const { type, count } = c.req.valid('query');
    const auth = c.get('auth');
    const data = [];

    for (let i = 0; i < count; i++) {
      const rnd = crypto.randomUUID();
      const url = await minioClient.presignedPutObject(type, rnd, 60 * 15);

      data.push({
        url,
        key: rnd,
      });
    }

    const cacheKey = `upload-url:${auth.id}:${type}`;
    await cacheWrite(cacheKey, data, 60 * 15);

    return c.json(
      {
        data,
      },
      200
    );
  }
);

export const uploadsRouter = new Hono()
  .use(rateLimiter())
  .get('/new-url', ...getNewUploadUrl);
