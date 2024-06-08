import { clerkMiddleware } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { getAuth, rateLimiter } from '../../middlewares';
import { Env } from '../../start';
import { validateId, validateUsername } from '../dto';
import {
  createListItemSchema,
  createListSchema,
  validateDeleteListItemParams,
  validateItemListInfoParams,
} from './dto';
import * as repository from './repository';

const factory = createFactory<Env>();

const getMyLists = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  async (c) => {
    const result = await repository.getMyLists(c.get('auth').userId);

    return c.json(
      {
        data: result,
      },
      200
    );
  }
);

const getUsersPublicLists = factory.createHandlers(
  zValidator('param', validateUsername),
  async (c) => {
    const { username } = c.req.valid('param');

    const result = await repository.getUsersPublicLists(username);

    return c.json(
      {
        data: result,
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

const deleteListItem = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateDeleteListItemParams),
  async (c) => {
    const { id, itemId } = c.req.valid('param');
    const auth = c.get('auth');

    try {
      const deleted = await repository.deleteListItem(auth.userId, id, itemId);

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

const itemListInfo = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateItemListInfoParams),
  async (c) => {
    const { locationId } = c.req.valid('param');
    const auth = c.get('auth');

    const info = await repository.itemListInfo(auth.userId, locationId);

    return c.json(
      {
        data: info,
      },
      200
    );
  }
);

export const listsRouter = new Hono()
  .use(rateLimiter())
  .get('/my', ...getMyLists)
  .get('/user/:username', ...getUsersPublicLists)
  .get('/info/:locationId', ...itemListInfo)
  .get('/:id', ...getById)
  .post('/', ...createList)
  .post('/:id/items', ...createListItem)
  .delete('/:id', ...deleteList)
  .delete('/:id/items/:itemId', ...deleteListItem);
