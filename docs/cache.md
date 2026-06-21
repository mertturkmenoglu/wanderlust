# Cache

- We are using [Bentocache](https://bentocache.dev/docs/introduction) for caching.
- It's a multi-layer caching system.
- We are using:
  - For L1 caching: In memory cache.
  - For L2 caching: Redis.
- Code example:

```typescript
import * as $cache from '@/lib/cache';

@injectable()
export class SquirrelService {
	constructor(
		@inject(CacheService) private readonly cache: CacheService,
	) { }

	async getSquirrel(id: string) {
		const squirrel = await this.cache.namespace('squirrel').getOrSet({
			key: id,
			ttl: '1h',
			factory: async () => await this.getSquirrelFromDatabase(id),
		});

		return squirrel;
	}

	async getSquirrelFromDatabase(id: string) {
		// Fetch squirrel from database
	}
}
```

- You can find the package at `packages/cache`.
