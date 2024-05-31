import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { rateLimiter } from '../../middlewares';
import { Env } from '../../start';

const factory = createFactory<Env>();

const getReviewsOfLocation = factory.createHandlers(async (c) => {
  throw new HTTPException(501, {
    message: 'Not implemented',
  });
});

const getById = factory.createHandlers(async (c) => {
  throw new HTTPException(501, {
    message: 'Not implemented',
  });
});

const create = factory.createHandlers(async (c) => {
  throw new HTTPException(501, {
    message: 'Not implemented',
  });
});

const update = factory.createHandlers(async (c) => {
  throw new HTTPException(501, {
    message: 'Not implemented',
  });
});

const deleteReview = factory.createHandlers(async (c) => {
  throw new HTTPException(501, {
    message: 'Not implemented',
  });
});

export const reviewsRouter = new Hono()
  .use(rateLimiter())
  .get('/location/:id', ...getReviewsOfLocation)
  .get('/:id', ...getById)
  .post('/', ...create)
  .patch('/:id', ...update)
  .delete('/:id', ...deleteReview);
