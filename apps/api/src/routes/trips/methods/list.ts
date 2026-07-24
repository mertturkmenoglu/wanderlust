import { Tokens, Types } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { $includes, type DatabaseService, schema } from '@wanderlust/db';
import { count, desc, eq, or } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { os } from '../internal/router';

@injectable()
export class ListTripsMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.list.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.ListInput,
	): Promise<Trips.dto.ListOutput> {
		const offset = Types.Pagination.getOffset(data);

		const idsResult = await this.db
			.select({
				id: schema.trips.id,
			})
			.from(schema.trips)
			.leftJoin(
				schema.tripParticipants,
				eq(schema.tripParticipants.tripId, schema.trips.id),
			)
			.where(
				or(
					eq(schema.trips.ownerId, userId),
					eq(schema.tripParticipants.userId, userId),
				),
			)
			.orderBy(desc(schema.trips.createdAt))
			.offset(offset)
			.limit(data.pageSize);

		// Get unique trip ids
		const ids = Array.from(new Set(idsResult.map((r) => r.id)));

		const trips = await this.db.query.trips.findMany({
			where: {
				id: {
					in: ids,
				},
			},
			with: $includes.trip.with,
			orderBy: {
				createdAt: 'desc',
			},
		});

		const [countResult] = await this.db
			.select({
				count: count(),
			})
			.from(schema.trips)
			.leftJoin(
				schema.tripParticipants,
				eq(schema.tripParticipants.tripId, schema.trips.id),
			)
			.where(
				or(
					eq(schema.trips.ownerId, userId),
					eq(schema.tripParticipants.userId, userId),
				),
			);

		invariant(
			countResult,
			'INTERNAL_SERVER_ERROR',
			'Failed to retrieve trips count',
		);

		const totalRecords = countResult.count;

		return {
			trips,
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}
}
