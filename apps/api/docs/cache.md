# Cache

- We are using [Bentocache](https://bentocache.dev/docs/introduction) for caching.
- It's a multi-layer caching system.
- We are using:
  - For L1 caching: In memory cache.
  - For L2 caching: Redis.
- Code example:

```typescript
import * as $cache from '@/lib/cache';

const cache = ioc.resolve(CacheProvider.id);
const user = await cache.namespace('user').getOrSet({
  key: userId,
  ttl: '1h',
  factory: async () => await repository.getUserById(userId),
});
console.log(user);
```

- You can find the service code at the `src/lib/cache` directory.
