import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { canUpdateLocation } from '../../internal/authz';
import { os } from '../../internal/router';
import { LocationProvider } from '../../provides/location';
import { TripProvider } from '../../provides/trip';

@injectable()
export class UpdateLocationMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly tripProvider: TripProvider,
		@inject(LocationProvider)
		private readonly locationProvider: LocationProvider,
	) {}

	route() {
		return os.locations.update.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.UpdateLocationInput,
	): Promise<Trips.dto.UpdateLocationOutput> {
		const { trip } = await this.tripProvider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		invariant(
			canUpdateLocation(trip, userId),
			'FORBIDDEN',
			'User is not allowed to update locations on this trip',
		);

		const location = await this.locationProvider.find({
			locationId: data.locationId,
			userId,
			tx: this.db,
		});

		if (data.description === undefined) {
			data.description = location.description;
		}

		if (data.scheduledTime === undefined) {
			data.scheduledTime = location.scheduledTime;
		}

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

		const updatedLocation = await this.update(userId, data);

		return {
			location: updatedLocation,
		};
	}

	private async update(userId: string, data: Trips.dto.UpdateLocationInput) {
		const res = await this.db
			.update(schema.tripLocations)
			.set({
				scheduledTime: data.scheduledTime,
				description: data.description,
			})
			.where(
				and(
					eq(schema.tripLocations.id, data.locationId),
					eq(schema.tripLocations.tripId, data.id),
				),
			)
			.returning();

		invariant(
			res.length !== 0,
			'NOT_FOUND',
			`Trip location with id ${data.locationId} not found`,
		);

		const updatedLocation = await this.locationProvider.find({
			locationId: data.locationId,
			userId,
			tx: this.db,
		});

		return updatedLocation;
	}
}
