import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import { Preferences } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { cacheOptions } from '../shared/cache';
import { os } from '../shared/router';

@injectable()
export class GetPreferencesMethod {
	private readonly ns = cacheOptions.namespace;

	constructor(
		@inject(Tokens.Cache) private readonly cache: CacheService,
		@inject(Tokens.Database) private readonly db: DatabaseService,
	) {}

	route() {
		return os.get.handler(async ({ context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId);

			return result;
		});
	}

	private async execute(userId: string): Promise<Preferences.dto.GetOutput> {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: userId,
			ttl: cacheOptions.ttl.get,
			factory: () => this.find(userId),
			grace: cacheOptions.grace.get,
		});

		return result;
	}

	private async find(userId: string) {
		const pref = await findByUserId.execute(this.db, { userId });

		if (!pref) {
			return Preferences.dto.getOutput.parse({
				preferences: {
					userId,
					enableRecentViews: true,
					enableSearchHistory: true,
					mapStyle: 'light',
					searchRadius: 'close',
					theme: 'light',
					timezone: 'Etc/UTC',
					units: 'metric',
				},
			});
		}

		return {
			preferences: pref,
		};
	}
}

const findByUserId = definePreparedStatement({
	schema: z.object({
		userId: z.string(),
	}),
	statement: (db) => {
		return db.query.preferences
			.findFirst({
				where: {
					userId: { eq: sql.placeholder('userId') },
				},
			})
			.prepare('preferences_find_by_user_id');
	},
});
