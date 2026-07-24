import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { os } from '../../internal/router';
import { InviteProvider } from '../../provides/invite';

@injectable()
export class GetInviteDetailsMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(InviteProvider) private readonly provider: InviteProvider,
	) {}

	route() {
		return os.invites.getDetails.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.GetInviteDetailsInput,
	): Promise<Trips.dto.GetInviteDetailsOutput> {
		const { invite } = await this.provider.find({
			inviteId: data.inviteId,
			tripId: data.id,
			userId,
			tx: this.db,
		});

		return {
			invite,
		};
	}
}
