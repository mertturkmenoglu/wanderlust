import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { LocationProvider } from '../../provides/location';
import { TripProvider } from '../../provides/trip';
import { canCreateLocation } from '../../shared/authz';
import { os } from '../../shared/router';

@injectable()
export class CreateLocationMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly tripProvider: TripProvider,
		@inject(LocationProvider)
		private readonly locationProvider: LocationProvider,
	) {}

	route() {
		return os.locations.create.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.CreateLocationInput,
	): Promise<Trips.dto.CreateLocationOutput> {
		const { trip } = await this.tripProvider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		invariant(
			canCreateLocation(trip, userId),
			'FORBIDDEN',
			'User is not allowed to create locations on this trip',
		);

		invariant(
			data.scheduledTime.getTime() >= trip.startAt.getTime(),
			'BAD_REQUEST',
			'Location scheduled time cannot be before trip start date',
		);

		invariant(
			data.scheduledTime.getTime() <= trip.endAt.getTime(),
			'BAD_REQUEST',
			'Location scheduled time cannot be after trip end date',
		);

		if (data.description === undefined) {
			data.description = trip.description;
		}

		const result = await this.create(userId, data);

		return {
			location: result,
		};
	}

	private async create(userId: string, data: Trips.dto.CreateLocationInput) {
		const place = await this.db.query.places.findFirst({
			where: {
				id: data.placeId,
			},
		});

		invariant(place, 'NOT_FOUND', `Place with id ${data.placeId} not found`);

		const existing = await this.db.query.tripLocations.findFirst({
			where: {
				tripId: data.id,
				placeId: data.placeId,
			},
		});

		invariant(
			!existing,
			'CONFLICT',
			`Location with place id ${data.placeId} already exists in trip with id ${data.id}`,
		);

		const [newLocation] = await this.db
			.insert(schema.tripLocations)
			.values({
				id: nanoid(),
				tripId: data.id,
				placeId: data.placeId,
				scheduledTime: data.scheduledTime,
				description: data.description ?? '',
			})
			.returning();

		invariant(
			newLocation,
			'INTERNAL_SERVER_ERROR',
			'Failed to create trip location',
		);

		const location = await this.locationProvider.find({
			locationId: newLocation.id,
			userId,
			tx: this.db,
		});

		return location;
	}
}
