import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { canUpdateItineraryItem } from '../../internal/authz';
import { os } from '../../internal/router';
import { ItineraryProvider } from '../../provides/itinerary';
import { TripProvider } from '../../provides/trip';

@injectable()
export class UpdateItineraryItemMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly tripProvider: TripProvider,
		@inject(ItineraryProvider)
		private readonly itineraryProvider: ItineraryProvider,
	) {}

	route() {
		return os.itinerary.update.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.UpdateItineraryItemInput,
	): Promise<Trips.dto.UpdateItineraryItemOutput> {
		const { trip } = await this.tripProvider.find({
			id: data.tripId,
			userId,
			tx: this.db,
		});

		invariant(
			canUpdateItineraryItem(trip, userId),
			'FORBIDDEN',
			'User is not allowed to update itinerary items on this trip',
		);

		invariant(
			data.scheduledTime.getTime() >= trip.startAt.getTime(),
			'BAD_REQUEST',
			'Itinerary item scheduled time cannot be before trip start date',
		);

		invariant(
			data.scheduledTime.getTime() <= trip.endAt.getTime(),
			'BAD_REQUEST',
			'Itinerary item scheduled time cannot be after trip end date',
		);

		const updated = await this.update(userId, data);

		return {
			itineraryItem: updated,
		};
	}

	private async update(
		userId: string,
		data: Trips.dto.UpdateItineraryItemInput,
	) {
		const res = await this.db
			.update(schema.itineraryItems)
			.set(data)
			.where(
				and(
					eq(schema.itineraryItems.id, data.id),
					eq(schema.itineraryItems.tripId, data.tripId),
				),
			)
			.returning();

		invariant(
			res.length !== 0,
			'NOT_FOUND',
			`Itinerary item with id ${data.id} not found`,
		);

		const updated = await this.itineraryProvider.find({
			itineraryItemId: data.id,
			userId,
			tx: this.db,
		});

		return updated;
	}
}
