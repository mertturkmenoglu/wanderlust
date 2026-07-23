import { ORPCError } from '@orpc/client';
import { Tokens } from '@wanderlust/common';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import * as statements from './statements';

@injectable()
@TraceAll()
export class AggregatorRepository {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	async home() {
		const promises = await Promise.allSettled([
			statements.findFeaturedPlaces.execute(this.db, {}),
			statements.findPopularPlaces.execute(this.db, {}),
			statements.findNewPlaces.execute(this.db, {}),
			statements.findFavoritePlaces.execute(this.db, {}),
		]);

		if (promises.some((p) => p.status === 'rejected')) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to fetch aggregated data',
			});
		}

		return {
			featured: promises[0].status === 'fulfilled' ? promises[0].value : [],
			popular: promises[1].status === 'fulfilled' ? promises[1].value : [],
			new: promises[2].status === 'fulfilled' ? promises[2].value : [],
			favorites: promises[3].status === 'fulfilled' ? promises[3].value : [],
		};
	}
}
