import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { TripProvider } from '../../provides/trip';
import { canDeleteLocation } from '../../shared/authz';
import { os } from '../../shared/router';

@injectable()
export class DeleteLocationMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly tripProvider: TripProvider,
	) {}

	route() {
		return os.locations.delete.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.DeleteLocationInput,
	): Promise<Trips.dto.DeleteLocationOutput> {
		const { trip } = await this.tripProvider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		invariant(
			canDeleteLocation(trip, userId),
			'FORBIDDEN',
			'User is not allowed to delete locations on this trip',
		);

		const res = await this.db
			.delete(schema.tripLocations)
			.where(
				and(
					eq(schema.tripLocations.id, data.locationId),
					eq(schema.tripLocations.tripId, data.id),
				),
			);

		invariant(
			res.rowCount === 1,
			'NOT_FOUND',
			`Trip location with id ${data.locationId} not found`,
		);

		return {};
	}
}
