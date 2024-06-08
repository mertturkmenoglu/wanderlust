import { clerkMiddleware } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { logger } from '../../logger';
import { getAuth } from '../../middlewares';
import { withOffset } from '../../pagination';
import { Env } from '../../start';
import { validateId, validatePagination } from '../dto';
import { createFavoriteSchema } from './dto';
import * as repository from './repository';

const factory = createFactory<Env>();

const getFavorites = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('query', validatePagination),
  async (c) => {
    const pagination = withOffset(c.req.valid('query'));

    const result = await repository.getUserFavorites(
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

const isFavorite = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateId),
  async (c) => {
    const { id } = c.req.valid('param');

    const result = await repository.isFavorite(c.get('auth').userId, id);

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
  zValidator('json', createFavoriteSchema),
  async (c) => {
    const dto = c.req.valid('json');

    try {
      const result = await repository.createFavorite(
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
        message: 'Cannot create favorite',
      });
    }
  }
);

const deleteFavorite = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateId),
  async (c) => {
    const { id } = c.req.valid('param');

    try {
      await repository.deleteFavorite(c.get('auth').userId, id);
      return c.json({}, 204);
    } catch (e) {
      logger.error(e);
      throw new HTTPException(400, {
        message: 'Cannot delete favorite.',
      });
    }
  }
);

export const favoritesRouter = new Hono()
  .get('/', ...getFavorites)
  .get('/:id', ...isFavorite)
  .post('/', ...create)
  .delete('/:id', ...deleteFavorite);
