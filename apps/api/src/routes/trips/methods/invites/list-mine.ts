import { Tokens, Types } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { $includes, type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { os } from '../../shared/router';

@injectable()
export class ListMyInvitationsMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.invites.listMine.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.ListMyInvitesInput,
	): Promise<Trips.dto.ListMyInvitesOutput> {
		const offset = Types.Pagination.getOffset(data);

		const result = await this.db.query.tripInvites.findMany({
			where: {
				toId: userId,
			},
			orderBy: {
				sentAt: 'desc',
			},
			offset: offset,
			limit: data.pageSize,
			with: $includes.tripInvite.with,
		});

		const totalRecords = await this.db.$count(
			schema.tripInvites,
			eq(schema.tripInvites.toId, userId),
		);

		return {
			invites: result.map(({ fromUser, toUser, ...inv }) => ({
				...inv,
				from: fromUser,
				to: toUser,
			})),
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}
}
