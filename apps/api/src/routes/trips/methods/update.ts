import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import type { JobsService } from '@wanderlust/jobs';
import { nanoid } from '@wanderlust/uid';
import { and, eq, gt, lt, ne, or } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { TripProvider } from '../provides/trip';
import { canRead, canUpdateTrip } from '../shared/authz';
import { os } from '../shared/router';

@injectable()
export class UpdateTripMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly provider: TripProvider,
		@inject(Tokens.Jobs) private readonly jobs: JobsService,
	) {}

	route() {
		return os.update.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.UpdateInput,
	): Promise<Trips.dto.UpdateOutput> {
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

		const { trip } = await this.provider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		invariant(
			canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		invariant(
			canUpdateTrip(trip, userId),
			'FORBIDDEN',
			'User is not allowed to update this trip',
		);

		const [newTrip, isDateChanged] = await this.update(userId, data, trip);

		if (isDateChanged && newTrip.visibilityLevel !== 'private') {
			await this.jobs.notifications.queue.addBulk(
				newTrip.participants.map((p) => ({
					name: 'create-notification',
					data: {
						entityId: newTrip.id,
						entityType: 'trip',
						id: nanoid(),
						recipientId: p.userId,
						type: 'trip_update',
						data: {
							trip: {
								id: newTrip.id,
								title: newTrip.title,
							},
						},
					},
				})),
			);
		}

		return {
			trip: newTrip,
		};
	}

	private async update(
		userId: string,
		data: Trips.dto.UpdateInput,
		existing: Awaited<ReturnType<TripProvider['find']>>['trip'],
	) {
		let isDateChanged = false;

		if (data.startAt.getTime() !== existing.startAt.getTime()) {
			isDateChanged = true;
		}

		if (data.endAt.getTime() !== existing.endAt.getTime()) {
			isDateChanged = true;
		}

		await this.db.transaction(async (tx) => {
			// Update trip
			await tx
				.update(schema.trips)
				.set({
					title: data.title,
					description: data.description,
					visibilityLevel: data.visibilityLevel,
					startAt: data.startAt,
					endAt: data.endAt,
				})
				.where(eq(schema.trips.id, data.id));

			// If date changed, there could be dangling location entities
			// Move them into the new trip date range
			if (isDateChanged) {
				// If the location scheduled time is before the new start date
				// or after the new end date, set it to the new start date
				await tx
					.update(schema.tripLocations)
					.set({
						scheduledTime: data.startAt,
					})
					.where(
						and(
							eq(schema.tripLocations.tripId, data.id),
							or(
								lt(schema.tripLocations.scheduledTime, data.startAt),
								gt(schema.tripLocations.scheduledTime, data.endAt),
							),
						),
					);
			}

			// If the visibility level is changed to private,
			// there can't be any pending invites
			// there can't be any participants other than the owner
			// there can't be any comments (because their owners won't have access anymore)
			if (data.visibilityLevel === 'private') {
				// Remove all participants
				await tx
					.delete(schema.tripParticipants)
					.where(eq(schema.tripParticipants.tripId, data.id));

				// Remove all invites
				await tx
					.delete(schema.tripInvites)
					.where(eq(schema.tripInvites.tripId, data.id));

				// Remove all comments where the trip id matches and the comment user id is not the owner
				await tx
					.delete(schema.tripComments)
					.where(
						and(
							eq(schema.tripComments.tripId, data.id),
							ne(schema.tripComments.userId, userId),
						),
					);
			}
		});

		const { trip: updated } = await this.provider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		return [updated, isDateChanged] as const;
	}
}
