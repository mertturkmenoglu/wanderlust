import { clerkMiddleware } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { authorize, getAuth, rateLimiter } from '../../middlewares';
import { withOffset } from '../../pagination';
import { Env } from '../../start';
import { validateId, validatePagination } from '../dto';
import { createReviewSchema } from './dto';
import * as repository from './repository';

const factory = createFactory<Env>();

const getReviewsOfLocation = factory.createHandlers(
  zValidator('param', validateId),
  zValidator('query', validatePagination),
  authorize({ type: 'read-location' }),
  async (c) => {
    const { id } = c.req.valid('param');
    const paginationParams = withOffset(c.req.valid('query'));
    const result = await repository.getReviewsOfLocation(id, paginationParams);

    return c.json(
      {
        data: result.data,
        pagination: result.pagination,
      },
      200
    );
  }
);

const getById = factory.createHandlers(
  zValidator('param', validateId),
  async (c) => {
    const { id } = c.req.valid('param');
    const review = await repository.getById(id);

    if (!review) {
      throw new HTTPException(404, {
        message: 'Not Found',
      });
    }

    return c.json(
      {
        data: review,
      },
      200
    );
  }
);

const create = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('json', createReviewSchema),
  authorize({ type: 'create-review' }),
  async (c) => {
    const dto = c.req.valid('json');
    const userId = c.get('auth').userId;

    try {
      const review = await repository.createReview(userId, dto);

      return c.json(
        {
          data: review,
        },
        201
      );
    } catch (e) {
      throw new HTTPException(400, {
        message: 'Bad Request',
      });
    }
  }
);

const update = factory.createHandlers(async (c) => {
  throw new HTTPException(501, {
    message: 'Not implemented',
  });
});

const deleteReview = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateId),
  authorize({ type: 'delete-review' }),
  async (c) => {
    const { id } = c.req.valid('param');
    const userId = c.get('auth').userId;

    try {
      const result = await repository.deleteReview(id, userId);

      return c.json(
        {
          data: result,
        },
        200
      );
    } catch (e) {
      throw new HTTPException(400, {
        message: 'Bad Request',
      });
    }
  }
);

const like = factory.createHandlers(async (c) => {
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
  .delete('/:id', ...deleteReview)
  .post('/:id/like', ...like);
