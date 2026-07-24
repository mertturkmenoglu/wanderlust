import { Tokens, Types } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { $includes, type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { canReadComment } from '../../internal/authz';
import { os } from '../../internal/router';
import { TripProvider } from '../../provides/trip';

@injectable()
export class ListCommentsMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly provider: TripProvider,
	) {}

	route() {
		return os.comments.list.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.ListCommentsInput,
	): Promise<Trips.dto.ListCommentsOutput> {
		const { trip } = await this.provider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		invariant(
			canReadComment(trip, userId),
			'FORBIDDEN',
			'User is not allowed to read comments on this trip',
		);

		const offset = Types.Pagination.getOffset(data);

		const result = await this.db.query.tripComments.findMany({
			where: {
				tripId: data.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
			offset: offset,
			limit: data.pageSize,
			with: $includes.tripComment.with,
		});

		const totalRecords = await this.db.$count(
			schema.tripComments,
			eq(schema.tripComments.tripId, data.id),
		);

		return {
			comments: result,
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}
}
