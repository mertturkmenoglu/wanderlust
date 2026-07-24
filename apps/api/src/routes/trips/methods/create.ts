import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { os } from '../internal/router';
import { TripProvider } from '../provides/trip';

@injectable()
export class CreateTripMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
		@inject(TripProvider) private readonly provider: TripProvider,
	) {}

	route() {
		return os.create.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.CreateInput,
	): Promise<Trips.dto.CreateOutput> {
		invariant(
			data.startAt.getTime() < data.endAt.getTime(),
			'BAD_REQUEST',
			'Trip start date must be before end date',
		);

		invariant(
			data.startAt.getTime() > Date.now(),
			'BAD_REQUEST',
			'Trip start date must be in the future',
		);

		const { trip } = await this.create(userId, data);

		if (trip.visibilityLevel === 'public') {
			await this.activities.addActivity(trip.owner.username, 'create_trip', {
				trip: {
					id: trip.id,
					title: trip.title,
				},
			});
		}

		return {
			trip,
		};
	}

	private async create(userId: string, data: Trips.dto.CreateInput) {
		const result = await this.db.transaction(async (tx) => {
			const [newTrip] = await tx
				.insert(schema.trips)
				.values({
					id: nanoid(),
					ownerId: userId,
					title: data.title,
					description: data.description,
					visibilityLevel: data.visibilityLevel,
					startAt: data.startAt,
					endAt: data.endAt,
					requestedAmenities: [],
				})
				.returning();

			invariant(
				newTrip,
				'INTERNAL_SERVER_ERROR',
				'Failed to get trip after creation',
			);

			const trip = await this.provider.find({
				id: newTrip.id,
				userId,
				tx,
			});

			invariant(
				trip,
				'INTERNAL_SERVER_ERROR',
				'Failed to retrieve trip after creation',
			);

			return trip;
		});

		return result;
	}
}
