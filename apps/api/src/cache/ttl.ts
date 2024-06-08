import { CacheKey } from './keys';

const duration = {
  second: 1,
  minute: 60,
  hour: 60 * 60,
  day: 24 * 60 * 60,
} as const;

/**
 * Cache time-to-live in seconds.
 */
export const cacheTTL = {
  categories: 1 * duration.hour,
  'categories-with-count': 1 * duration.hour,
  'locations-countries': 1 * duration.day,
  'locations-peek': 1 * duration.hour,
} as const satisfies Record<CacheKey, number>;
