import { clerkMiddleware } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { authorize, getAuth, rateLimiter, withAuth } from '../../middlewares';
import { withOffset } from '../../pagination';
import { Env } from '../../start';
import { validateId, validatePagination, validateUsername } from '../dto';
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
  clerkMiddleware(),
  withAuth,
  zValidator('param', validateId),
  async (c) => {
    const { id } = c.req.valid('param');
    const auth = c.get('withAuth');
    const { data, metadata } = await repository.getById(id, auth?.userId);

    return c.json(
      {
        data,
        metadata,
      },
      200
    );
  }
);

const getByUsername = factory.createHandlers(
  zValidator('param', validateUsername),
  zValidator('query', validatePagination),
  async (c) => {
    const { username } = c.req.valid('param');
    const paginationParams = withOffset(c.req.valid('query'));

    const result = await repository.getReviewsByUsername(
      username,
      paginationParams
    );

    return c.json(
      {
        data: result.data,
        pagination: result.pagination,
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

const like = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateId),
  async (c) => {
    const { id } = c.req.valid('param');
    const auth = c.get('auth');

    try {
      const like = await repository.likeReview(id, auth.userId);

      return c.json(
        {
          data: like,
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

const unlike = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateId),
  async (c) => {
    const { id } = c.req.valid('param');
    const auth = c.get('auth');

    try {
      const like = await repository.unlikeReview(id, auth.userId);

      return c.json(
        {
          data: like,
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

export const reviewsRouter = new Hono()
  .use(rateLimiter())
  .get('/location/:id', ...getReviewsOfLocation)
  .get('/user/:username', ...getByUsername)
  .get('/:id', ...getById)
  .post('/', ...create)
  .patch('/:id', ...update)
  .delete('/:id', ...deleteReview)
  .post('/:id/like', ...like)
  .delete('/:id/unlike', ...unlike);
