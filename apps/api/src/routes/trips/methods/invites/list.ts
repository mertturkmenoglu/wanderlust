import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { $includes, type DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { os } from '../../internal/router';
import { TripProvider } from '../../provides/trip';

@injectable()
export class ListInvitesMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly provider: TripProvider,
	) {}

	route() {
		return os.invites.list.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.ListInvitesInput,
	): Promise<Trips.dto.ListInvitesOutput> {
		// Ensure the user has access to the trip (checks for read access)
		await this.provider.find({
			id: data.id,
			userId,
			tx: this.db,
		});

		const result = await this.db.query.tripInvites.findMany({
			where: {
				tripId: data.id,
			},
			with: $includes.tripInvite.with,
		});

		return {
			invites: result.map(({ fromUser, toUser, ...inv }) => ({
				...inv,
				from: fromUser,
				to: toUser,
			})),
		};
	}
}
