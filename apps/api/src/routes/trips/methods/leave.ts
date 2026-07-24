import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { isOwner } from '../internal/authz';
import { os } from '../internal/router';
import { TripProvider } from '../provides/trip';

@injectable()
export class LeaveTripMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly provider: TripProvider,
	) {}

	route() {
		return os.leave.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.LeaveInput,
	): Promise<Trips.dto.LeaveOutput> {
		const { trip } = await this.provider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		invariant(
			isOwner(trip, userId) === false,
			'FORBIDDEN',
			'Owner of the trip cannot leave the trip',
		);

		const res = await this.db
			.delete(schema.tripParticipants)
			.where(
				and(
					eq(schema.tripParticipants.tripId, data.id),
					eq(schema.tripParticipants.userId, userId),
				),
			);

		invariant(res.rowCount === 1, 'NOT_FOUND', 'Trip participant not found');

		return {};
	}
}
