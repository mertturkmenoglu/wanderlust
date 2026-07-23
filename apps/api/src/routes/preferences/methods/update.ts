import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Preferences } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { cacheOptions } from '../shared/cache';
import { os } from '../shared/router';

@injectable()
export class UpdatePreferencesMethod {
	private readonly ns = cacheOptions.namespace;

	constructor(
		@inject(Tokens.Cache) private readonly cache: CacheService,
		@inject(Tokens.Database) private readonly db: DatabaseService,
	) {}

	route() {
		return os.update.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Preferences.dto.UpdateInput,
	): Promise<Preferences.dto.UpdateOutput> {
		const [updated] = await this.db
			.insert(schema.preferences)
			.values([
				{
					userId: userId,
					...data,
				},
			])
			.onConflictDoUpdate({
				target: schema.preferences.userId,
				set: data,
			})
			.returning();

		invariant(
			updated,
			'INTERNAL_SERVER_ERROR',
			'Failed to update preferences for user',
		);

		await this.cache.namespace(this.ns).delete({
			key: cacheOptions.keys.get(userId),
		});

		return {
			preferences: updated,
		};
	}
}
