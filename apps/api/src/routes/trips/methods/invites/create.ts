import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { $includes, type DatabaseService, schema } from '@wanderlust/db';
import type { JobsService } from '@wanderlust/jobs';
import { nanoid } from '@wanderlust/uid';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { canCreateInvite } from '../../internal/authz';
import { os } from '../../internal/router';
import { TripProvider } from '../../provides/trip';

@injectable()
export class CreateInviteMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly provider: TripProvider,
		@inject(Tokens.Jobs) private readonly jobs: JobsService,
	) {}

	route() {
		return os.invites.create.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.CreateInviteInput,
	): Promise<Trips.dto.CreateInviteOutput> {
		const { trip } = await this.provider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		invariant(
			canCreateInvite(trip, userId),
			'FORBIDDEN',
			'User is not allowed to invite participants to this trip',
		);

		invariant(
			trip.visibilityLevel !== 'private',
			'CONFLICT',
			'Cannot invite participants to private trips',
		);

		const result = await this.create(userId, data, trip.title);

		await this.jobs.notifications.queue.add('create-notification', {
			id: nanoid(),
			entityId: trip.id,
			entityType: 'trip',
			recipientId: result.toId,
			type: 'trip_invite',
			data: {
				trip: {
					id: trip.id,
					title: trip.title,
				},
				role: result.role,
				from: result.from,
			},
		});

		return {
			invite: result,
		};
	}

	private async create(
		userId: string,
		data: Trips.dto.CreateInviteInput,
		tripTitle: string,
	) {
		const { fromUser, toUser, ...inv } = await this.db.transaction(
			async (tx) => {
				const inv = await tx.query.tripInvites.findFirst({
					where: {
						tripId: data.id,
						toId: data.toUserId,
					},
				});

				invariant(
					!inv,
					'CONFLICT',
					`Invite already exists for user with id ${data.toUserId} to trip with id ${data.id}`,
				);

				const now = new Date();

				const [newInv] = await tx
					.insert(schema.tripInvites)
					.values({
						id: nanoid(),
						fromId: userId,
						tripId: data.id,
						toId: data.toUserId,
						tripTitle: tripTitle,
						sentAt: now,
						expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days later
						role: data.role,
					})
					.returning();

				invariant(
					newInv,
					'INTERNAL_SERVER_ERROR',
					'Failed to get invite after creation',
				);

				const invite = await tx.query.tripInvites.findFirst({
					where: {
						id: newInv.id,
					},
					with: $includes.tripInvite.with,
				});

				invariant(
					invite,
					'INTERNAL_SERVER_ERROR',
					'Failed to retrieve invite after creation',
				);

				return invite;
			},
		);

		return {
			...inv,
			from: fromUser,
			to: toUser,
		};
	}
}
