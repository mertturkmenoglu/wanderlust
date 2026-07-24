import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import type { JobsService } from '@wanderlust/jobs';
import { nanoid } from '@wanderlust/uid';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { canCreateComment } from '../../internal/authz';
import { os } from '../../internal/router';
import { TripProvider } from '../../provides/trip';

@injectable()
export class CreateCommentMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly provider: TripProvider,
		@inject(Tokens.Jobs) private readonly jobs: JobsService,
	) {}

	route() {
		return os.comments.create.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.CreateCommentInput,
	): Promise<Trips.dto.CreateCommentOutput> {
		const { trip } = await this.provider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		invariant(
			canCreateComment(trip, userId),
			'FORBIDDEN',
			'User is not allowed to create comments on this trip',
		);

		const result = await this.create(userId, data);

		if (result.userId !== trip.ownerId) {
			await this.jobs.notifications.queue.add('create-notification', {
				entityId: trip.id,
				entityType: 'trip',
				id: nanoid(),
				recipientId: trip.ownerId,
				type: 'trip_add_comment',
				data: {
					trip: {
						id: trip.id,
						title: trip.title,
					},
				},
			});
		}

		return {
			comment: result,
		};
	}

	private async create(userId: string, data: Trips.dto.CreateCommentInput) {
		const [result] = await this.db
			.insert(schema.tripComments)
			.values({
				id: nanoid(),
				tripId: data.id,
				userId: userId,
				content: data.content,
				createdAt: new Date(),
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'Failed to create comment');

		return result;
	}
}
