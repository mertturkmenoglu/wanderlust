import { clerkMiddleware } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { logger } from '../../logger';
import { authorize, getAuth } from '../../middlewares';
import { withOffset } from '../../pagination';
import { Env } from '../../start';
import { validateId, validatePagination } from '../dto';
import { createBookmarkSchema } from './dto';
import * as repository from './repository';

const factory = createFactory<Env>();

const getBookmarks = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('query', validatePagination),
  authorize({ type: 'read-bookmark' }),
  async (c) => {
    const pagination = withOffset(c.req.valid('query'));

    const result = await repository.getUserBookmarks(
      c.get('auth').userId,
      pagination
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

const isBookmarked = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateId),
  authorize({ type: 'read-bookmark' }),
  async (c) => {
    const { id } = c.req.valid('param');

    const result = await repository.isBookmarked(c.get('auth').userId, id);

    return c.json(
      {
        data: result,
      },
      200
    );
  }
);

const create = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('json', createBookmarkSchema),
  authorize({ type: 'create-bookmark' }),
  async (c) => {
    const dto = c.req.valid('json');

    try {
      const result = await repository.createBookmark(
        c.get('auth').userId,
        dto.locationId
      );

      return c.json(
        {
          data: result,
        },
        201
      );
    } catch (e) {
      logger.error(e);
      throw new HTTPException(400, {
        message: 'Cannot create bookmark.',
      });
    }
  }
);

const deleteBookmark = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  authorize({ type: 'delete-bookmark' }),
  zValidator('param', validateId),
  async (c) => {
    const { id } = c.req.valid('param');

    try {
      await repository.deleteBookmark(c.get('auth').userId, id);
      return c.json({}, 204);
    } catch (e) {
      logger.error(e);
      throw new HTTPException(400, {
        message: 'Cannot delete bookmark.',
      });
    }
  }
);

export const bookmarksRouter = new Hono()
  .get('/', ...getBookmarks)
  .get('/:id', ...isBookmarked)
  .post('/', ...create)
  .delete('/:id', ...deleteBookmark);
