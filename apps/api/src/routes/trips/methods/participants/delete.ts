import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { TripProvider } from '../../provides/trip';
import { canDeleteParticipant } from '../../shared/authz';
import { os } from '../../shared/router';

@injectable()
export class DeleteParticipantMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly provider: TripProvider,
	) {}

	route() {
		return os.participants.delete.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.DeleteParticipantInput,
	): Promise<Trips.dto.DeleteParticipantOutput> {
		const { trip } = await this.provider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		invariant(
			canDeleteParticipant(trip, userId, data.userId),
			'FORBIDDEN',
			'User is not allowed to remove this participant from the trip',
		);

		const res = await this.db
			.delete(schema.tripParticipants)
			.where(
				and(
					eq(schema.tripParticipants.tripId, data.id),
					eq(schema.tripParticipants.userId, data.userId),
				),
			);

		invariant(res.rowCount === 1, 'NOT_FOUND', 'Trip participant not found');

		return {};
	}
}
