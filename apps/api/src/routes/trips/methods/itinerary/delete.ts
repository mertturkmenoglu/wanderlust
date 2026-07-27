import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { canDeleteItineraryItem } from '../../internal/authz';
import { os } from '../../internal/router';
import { TripProvider } from '../../provides/trip';

@injectable()
export class DeleteItineraryItemMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly tripProvider: TripProvider,
	) {}

	route() {
		return os.itinerary.delete.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.DeleteItineraryItemInput,
	): Promise<Trips.dto.DeleteItineraryItemOutput> {
		const { trip } = await this.tripProvider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		invariant(
			canDeleteItineraryItem(trip, userId),
			'FORBIDDEN',
			'User is not allowed to delete itinerary items on this trip',
		);

		const res = await this.db
			.delete(schema.itineraryItems)
			.where(
				and(
					eq(schema.itineraryItems.id, data.id),
					eq(schema.itineraryItems.tripId, data.tripId),
				),
			);

		invariant(
			res.rowCount === 1,
			'NOT_FOUND',
			`Itinerary item with id ${data.id} not found`,
		);

		return {};
	}
}
