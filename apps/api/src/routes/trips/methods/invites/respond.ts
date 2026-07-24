import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import type { JobsService } from '@wanderlust/jobs';
import { nanoid } from '@wanderlust/uid';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { os } from '../../internal/router';
import { InviteProvider } from '../../provides/invite';

@injectable()
export class RespondMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(InviteProvider) private readonly provider: InviteProvider,
		@inject(Tokens.Jobs) private readonly jobs: JobsService,
	) {}

	route() {
		return os.invites.respond.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.RespondInput,
	): Promise<Trips.dto.RespondOutput> {
		const { invite } = await this.provider.find({
			inviteId: data.inviteId,
			userId,
			tripId: data.id,
			tx: this.db,
		});

		const accepted = await this.respond(userId, data, invite.role);

		if (accepted) {
			await this.jobs.notifications.queue.add('create-notification', {
				entityId: invite.tripId,
				entityType: 'trip',
				id: nanoid(),
				recipientId: invite.trip.ownerId,
				type: 'trip_add_user',
				data: {
					newUser: invite.to,
				},
			});
		}

		return {
			accepted,
		};
	}

	private async respond(
		userId: string,
		data: Trips.dto.RespondInput,
		role: 'member' | 'editor',
	) {
		return await this.db.transaction(async (tx) => {
			// Whether the invite is accepted or declined, delete the invite
			const deleteInviteResult = await tx
				.delete(schema.tripInvites)
				.where(eq(schema.tripInvites.id, data.inviteId));

			invariant(
				deleteInviteResult.rowCount === 1,
				'INTERNAL_SERVER_ERROR',
				'Failed to delete invite on acceptance',
			);

			// If accepted, add the user as a participant
			// Else, do nothing
			if (data.accept) {
				await tx
					.insert(schema.tripParticipants)
					.values({
						id: nanoid(),
						tripId: data.id,
						userId: userId,
						role: role,
					})
					.returning();
			}

			return data.accept;
		});
	}
}
