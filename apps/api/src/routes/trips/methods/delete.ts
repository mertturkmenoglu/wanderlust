import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { canDeleteTrip } from '../internal/authz';
import { os } from '../internal/router';
import { TripProvider } from '../provides/trip';

@injectable()
export class DeleteTripMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly provider: TripProvider,
	) {}

	route() {
		return os.delete.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.DeleteInput,
	): Promise<Trips.dto.DeleteOutput> {
		const { trip } = await this.provider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		invariant(
			canDeleteTrip(trip, userId),
			'FORBIDDEN',
			'Only the owner can delete the trip',
		);

		const res = await this.db
			.delete(schema.trips)
			.where(
				and(eq(schema.trips.id, data.id), eq(schema.trips.ownerId, userId)),
			);

		invariant(
			res.rowCount === 1,
			'NOT_FOUND',
			'Trip not found or user is not the owner',
		);

		return {};
	}
}
