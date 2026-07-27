import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { canCreateItineraryItem } from '../../internal/authz';
import { os } from '../../internal/router';
import { ItineraryProvider } from '../../provides/itinerary';
import { TripProvider } from '../../provides/trip';

@injectable()
export class CreateItineraryItemMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly tripProvider: TripProvider,
		@inject(ItineraryProvider)
		private readonly itineraryProvider: ItineraryProvider,
	) {}

	route() {
		return os.itinerary.create.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.CreateItineraryItemInput,
	): Promise<Trips.dto.CreateItineraryItemOutput> {
		const { trip } = await this.tripProvider.find({
			id: data.tripId,
			userId,
			tx: this.db,
		});

		invariant(
			canCreateItineraryItem(trip, userId),
			'FORBIDDEN',
			'User is not allowed to create itinerary items on this trip',
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

		const result = await this.create(userId, data);

		return {
			itineraryItem: result,
		};
	}

	private async create(
		userId: string,
		data: Trips.dto.CreateItineraryItemInput,
	) {
		if (data.placeId) {
			const place = await this.db.query.places.findFirst({
				where: {
					id: data.placeId,
				},
			});

			invariant(place, 'NOT_FOUND', `Place with id ${data.placeId} not found`);
		}

		const [newItem] = await this.db
			.insert(schema.itineraryItems)
			.values(data)
			.returning();

		invariant(
			newItem,
			'INTERNAL_SERVER_ERROR',
			'Failed to create itinerary item',
		);

		const item = await this.itineraryProvider.find({
			itineraryItemId: newItem.id,
			userId,
			tx: this.db,
		});

		return item;
	}
}
