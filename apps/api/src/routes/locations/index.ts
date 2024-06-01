import { clerkMiddleware } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { authorize, getAuth, rateLimiter, withAuth } from '../../middlewares';
import * as search from '../../search';
import { Env, onlyDev } from '../../start';
import { validateId } from '../dto';
import {
  createLocationSchema,
  getCitiesSchema,
  getStatesSchema,
  updateLocationSchema,
} from './dto';
import * as repository from './repository';

const factory = createFactory<Env>();

const peek = factory.createHandlers(async (c) => {
  const results = await repository.peek();

  return c.json(
    {
      data: results,
    },
    200
  );
});

const countries = factory.createHandlers(async (c) => {
  const results = await repository.getCountries();

  return c.json(
    {
      data: results,
    },
    200
  );
});

const states = factory.createHandlers(
  zValidator('query', getStatesSchema),
  async (c) => {
    const { countryId } = c.req.valid('query');
    const results = await repository.getStates(countryId);

    return c.json(
      {
        data: results,
      },
      200
    );
  }
);

const cities = factory.createHandlers(
  zValidator('query', getCitiesSchema),
  async (c) => {
    const { countryId, stateId } = c.req.valid('query');
    const results = await repository.getCities(countryId, stateId);

    return c.json(
      {
        data: results,
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

    if (!data) {
      throw new HTTPException(404, {
        message: 'Not found',
      });
    }

    return c.json(
      {
        data,
        metadata,
      },
      200
    );
  }
);

const create = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('json', createLocationSchema),
  authorize({ type: 'create-location' }),
  async (c) => {
    const dto = c.req.valid('json');

    try {
      const location = await repository.create(dto);
      await search.upsertLocation(location);

      return c.json(
        {
          data: location,
        },
        201
      );
    } catch (e) {
      throw new HTTPException(500, {
        message: 'Something went wrong',
        cause: onlyDev(e),
      });
    }
  }
);

const update = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateId),
  zValidator('json', updateLocationSchema),
  authorize({ type: 'update-location' }),
  async (c) => {
    const { id } = c.req.valid('param');
    const dto = c.req.valid('json');
    const location = await repository.update(id, dto);

    if (!location) {
      throw new HTTPException(404, {
        message: 'Not found',
      });
    }

    await search.upsertLocation(location);

    return c.json(
      {
        data: location,
      },
      200
    );
  }
);

const deleteLocation = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateId),
  authorize({ type: 'delete-location' }),
  async (c) => {
    const { id } = c.req.valid('param');
    const location = await repository.deleteLocation(id);

    if (!location) {
      throw new HTTPException(404, {
        message: 'Not found',
      });
    }

    await search.deleteLocation(id);

    return c.json(
      {
        data: location,
      },
      200
    );
  }
);

export const locationsRouter = new Hono()
  .use(rateLimiter())
  .get('/peek', ...peek)
  .get('/countries', ...countries)
  .get('/states', ...states)
  .get('/cities', ...cities)
  .get('/:id', ...getById)
  .post('/', ...create)
  .patch('/:id', ...update)
  .delete('/:id', ...deleteLocation);
