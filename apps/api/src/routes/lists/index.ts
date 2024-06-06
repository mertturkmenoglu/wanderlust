import { clerkMiddleware } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { getAuth, rateLimiter, withAuth } from '../../middlewares';
import { withOffset } from '../../pagination';
import { Env } from '../../start';
import { validateId, validatePagination } from '../dto';
import { createListItemSchema, createListSchema } from './dto';
import * as repository from './repository';

const factory = createFactory<Env>();

const getMyLists = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('query', validatePagination),
  async (c) => {
    const pagination = withOffset(c.req.valid('query'));

    const result = await repository.getMyLists(
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

const getById = factory.createHandlers(
  zValidator('param', validateId),
  async (c) => {
    const { id } = c.req.valid('param');

    const list = await repository.getById(id);

    if (!list) {
      throw new HTTPException(404, {
        message: 'List not found',
      });
    }

    return c.json(
      {
        data: list,
      },
      200
    );
  }
);

const getListItems = factory.createHandlers(
  clerkMiddleware(),
  withAuth,
  zValidator('param', validateId),
  zValidator('query', validatePagination),
  async (c) => {
    const { id } = c.req.valid('param');
    const pagination = withOffset(c.req.valid('query'));
    const auth = c.get('withAuth');

    const result = await repository.getListItems(id, pagination, auth?.userId);

    return c.json(
      {
        data: result.data,
        pagination: result.pagination,
      },
      200
    );
  }
);

const createListItem = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateId),
  zValidator('json', createListItemSchema),
  async (c) => {
    const { id: listId } = c.req.valid('param');
    const dto = c.req.valid('json');
    const auth = c.get('auth');

    const item = await repository.createListItem(auth.userId, listId, dto);

    return c.json(
      {
        data: item,
      },
      201
    );
  }
);

const createList = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('json', createListSchema),
  async (c) => {
    const dto = c.req.valid('json');
    const auth = c.get('auth');

    try {
      const list = await repository.create(auth.userId, dto);

      return c.json(
        {
          data: list,
        },
        201
      );
    } catch (e) {
      throw new HTTPException(400, {
        message: 'Invalid request',
      });
    }
  }
);

const deleteList = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateId),
  async (c) => {
    const { id } = c.req.valid('param');
    const auth = c.get('auth');

    try {
      const deleted = await repository.deleteList(auth.userId, id);

      if (!deleted) {
        throw new HTTPException(404, {
          message: 'List not found',
        });
      }

      return c.json(
        {
          data: deleted,
        },
        200
      );
    } catch (e) {
      throw new HTTPException(400, {
        message: 'Invalid request',
      });
    }
  }
);

export const listsRouter = new Hono()
  .use(rateLimiter())
  .get('/my', ...getMyLists)
  .get('/:id', ...getById)
  .get('/:id/items', ...getListItems)
  .post('/', ...createList)
  .post('/:id/items', ...createListItem)
  .delete('/:id', ...deleteList);
