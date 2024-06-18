import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { cacheTTL, cacheWrite } from '../../cache';
import { checkCache } from '../../middlewares';
import { Env } from '../../start';
import * as locationsRepository from '../locations/repository';

function isFullfilled<T>(
  promise: PromiseSettledResult<T>
): promise is PromiseFulfilledResult<T> {
  return promise.status === 'fulfilled';
}

const factory = createFactory();

type HomeAggregation = Record<
  'new' | 'popular' | 'featured' | 'favorite',
  Awaited<ReturnType<typeof locationsRepository.peek>>
>;

const getHome = factory.createHandlers(
  checkCache<HomeAggregation>('aggregate-home'),
  async (c) => {
    const keys = ['new', 'popular', 'featured', 'favorite'] as const;
    const results = await Promise.allSettled([
      locationsRepository.peek('new'),
      locationsRepository.peek('popular'),
      locationsRepository.peek('featured'),
      locationsRepository.peek('favorite'),
    ]);

    if (results.some((r) => r.status === 'rejected')) {
      throw new HTTPException(500, {
        message: 'One or more of the queries failed.',
      });
    }

    const rec: HomeAggregation = {
      new: [],
      popular: [],
      featured: [],
      favorite: [],
    };

    const fulfilled = results.filter(isFullfilled);

    for (let i = 0; i < keys.length; i++) {
      rec[keys[i]] = fulfilled[i].value;
    }

    await cacheWrite('aggregate-home', rec, cacheTTL['aggregate-home']);

    return c.json(
      {
        data: rec,
      },
      200
    );
  }
);

export const aggregatorRouter = new Hono<Env>().get('/home', ...getHome);
