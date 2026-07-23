import { trace } from '@opentelemetry/api';
import { Tokens } from '@wanderlust/common';
import type { Favorites } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';

@injectable()
export class CreateFavoriteMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
	) {}

	route() {
		return os.create.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const username = context.session.user.username;
			const result = await this.execute(userId, username, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		username: string,
		data: Favorites.dto.CreateInput,
	): Promise<Favorites.dto.CreateOutput> {
		const span = trace.getActiveSpan();

		const [inserted, place] = await this.db.transaction(async (tx) => {
			const [result] = await tx
				.insert(schema.favorites)
				.values({
					userId: userId,
					placeId: data.placeId,
				})
				.returning();

			invariant(result, 'INTERNAL_SERVER_ERROR', 'No favorite returned');

			await tx
				.update(schema.places)
				.set({
					totalFavorites: sql`${schema.places.totalFavorites} + 1`,
				})
				.where(eq(schema.places.id, data.placeId));

			const place = await tx.query.places.findFirst({
				where: {
					id: data.placeId,
				},
				columns: {
					id: true,
					name: true,
				},
			});

			invariant(place, 'NOT_FOUND', `Place with ID ${data.placeId} not found`);

			return [result, place] as const;
		});

		try {
			await this.activities.addActivity(username, 'create_favorite', {
				place: {
					id: place.id,
					name: place.name,
				},
			});
		} catch (err) {
			span?.recordException(err as Error);
			// Then intentionally swallow the error, as we don't want to fail the request if the activity creation fails.
		}

		return {
			favorite: inserted,
		};
	}
}
