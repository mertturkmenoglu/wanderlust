# Cache

- We are using [Bentocache](https://bentocache.dev/docs/introduction) for caching.
- It's a multi-layer caching system.
- We are using:
  - For L1 caching: In memory cache.
  - For L2 caching: Redis.
- Code example:

```typescript
@injectable()
export class SquirrelService {
	private readonly ns = 'squirrels';
	private readonly cache: TCacheService;

	constructor(
		@inject(CacheService) cache: CacheService,
	) {
		this.cache = cache.get();
	}

	async getSquirrel(id: string) {
		const squirrel = await this.cache.namespace(this.ns).getOrSet({
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

## Patterns

- Create a namespace for each resource type. Example:

```typescript
class ReviewsService {
	private readonly ns = 'reviews';

	async foo(id: string) {
		const review = await this.cache.namespace(this.ns).getOrSet({
			key: id,
			ttl: '1h',
			factory: async () => await this.getReviewFromDatabase(id),
		});

		return review;
	}
}
```

- Use appropriate TTL (time to live) values. If the data is global (like the list of cities) and doesn't change often, use a longer TTL. If the data is user-specific (like the user's profile), use a shorter TTL.

- Define a clear cache invalidation strategy. When the underlying data changes, make sure to invalidate the cache for that specific key or namespace. Define helper functions. This way, if you need to invalidate more than one key, you can do it in a single function call.
