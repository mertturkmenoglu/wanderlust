import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { TripProvider } from '../../provides/trip';
import { canDeleteInvite } from '../../shared/authz';
import { os } from '../../shared/router';

@injectable()
export class DeleteInviteMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly provider: TripProvider,
	) {}

	route() {
		return os.invites.delete.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.DeleteInviteInput,
	): Promise<Trips.dto.DeleteInviteOutput> {
		const { trip } = await this.provider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		invariant(
			canDeleteInvite(trip, userId),
			'FORBIDDEN',
			'User is not allowed to delete invites for this trip',
		);

		const res = await this.db
			.delete(schema.tripInvites)
			.where(
				and(
					eq(schema.tripInvites.id, data.inviteId),
					eq(schema.tripInvites.tripId, data.id),
				),
			);

		invariant(res.rowCount === 1, 'NOT_FOUND', 'Trip invite not found');

		return {};
	}
}
