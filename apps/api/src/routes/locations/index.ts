import { clerkMiddleware } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { cacheTTL, cacheWrite } from '../../cache';
import { logger } from '../../logger';
import {
  authorize,
  checkCache,
  getAuth,
  rateLimiter,
  withAuth,
} from '../../middlewares';
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

type PeekResult = Awaited<ReturnType<typeof repository.peek>>;

const peek = factory.createHandlers(
  checkCache<PeekResult>('locations-peek'),
  async (c) => {
    const results = await repository.peek();
    await cacheWrite('locations-peek', results, cacheTTL['locations-peek']);

    return c.json(
      {
        data: results,
      },
      200
    );
  }
);

type Countries = Awaited<ReturnType<typeof repository.getCountries>>;

const countries = factory.createHandlers(
  checkCache<Countries>('locations-countries'),
  async (c) => {
    const results = await repository.getCountries();
    await cacheWrite(
      'locations-countries',
      results,
      cacheTTL['locations-countries']
    );

    return c.json(
      {
        data: results,
      },
      200
    );
  }
);

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
    let location: Awaited<ReturnType<typeof repository.create>> | null = null;

    try {
      location = await repository.create(dto);
    } catch (e) {
      throw new HTTPException(400, {
        message: 'Cannot create location',
        cause: onlyDev(e),
      });
    }

    try {
      await search.upsertLocation(location);
    } catch (e) {
      logger.error('Cannot upsert location to search', e);
    }

    if (!location) {
      throw new HTTPException(500, {
        message: 'Cannot create location',
      });
    }

    return c.json(
      {
        data: location,
      },
      201
    );
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
