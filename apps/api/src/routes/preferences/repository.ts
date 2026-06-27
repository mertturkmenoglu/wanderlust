import type { preferences as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';

type TxFn = Parameters<TDatabaseService['transaction']>[0];
type Tx = Parameters<TxFn>[0];

@injectable()
export class PreferencesRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	private async findById(
		userId: string,
		tx: Tx,
	): Promise<dto.GetOutput['preferences'] | undefined> {
		return tx.query.preferences.findFirst({
			where: (t, { eq }) => eq(t.userId, userId),
		});
	}

	async get(userId: string, _data: dto.GetInput): Promise<dto.GetOutput> {
		const preferences = await this.db.transaction(async (tx) => {
			const result = await this.findById(userId, tx);

			if (!result) {
				const [inserted] = await tx
					.insert(schema.preferences)
					.values({
						userId: userId,
					})
					.returning();

				invariant(
					inserted,
					'INTERNAL_SERVER_ERROR',
					'Failed to create preferences for user',
				);

				return inserted;
			}

			return result;
		});

		return {
			preferences,
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
