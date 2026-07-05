import { preferences as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { Trace, TraceAll } from '@/lib/tracer';
import { findByUserId } from './statements';

@injectable()
@TraceAll()
export class PreferencesRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	@Trace()
	async get(userId: string, _data: dto.GetInput): Promise<dto.GetOutput> {
		const pref = await findByUserId.execute(this.db, { userId });

		if (!pref) {
			return dto.getOutput.parse({ userId: userId });
		}

		return {
			preferences: pref,
		};
	}

	async update(
		userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
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
