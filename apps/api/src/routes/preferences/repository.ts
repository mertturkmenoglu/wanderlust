import { Tokens } from '@wanderlust/common';
import { Preferences } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { Trace, TraceAll } from '@/lib/tracer';
import { findByUserId } from './statements';

@injectable()
@TraceAll()
export class PreferencesRepository {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	@Trace()
	async get(
		userId: string,
		_data: Preferences.dto.GetInput,
	): Promise<Preferences.dto.GetOutput> {
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

	async update(
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

		return {
			preferences: updated,
		};
	}
}
