import { cache } from './init';
import { CacheKey } from './keys';

export async function cacheRead<T>(key: CacheKey | string) {
  const cacheResult = await cache.get(key);

  if (cacheResult === null) {
    return null;
  }

  try {
    return JSON.parse(cacheResult) as T;
  } catch (e) {
    return null;
  }
}

export async function cacheWrite<T>(
  key: CacheKey | string,
  value: T,
  ttl: number
) {
  await cache.set(key, JSON.stringify(value), 'EX', ttl);
}
