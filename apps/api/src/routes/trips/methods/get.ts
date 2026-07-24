import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { os } from '../internal/router';
import { TripProvider } from '../provides/trip';

@injectable()
export class GetTripMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly provider: TripProvider,
	) {}

	route() {
		return os.get.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.GetInput,
	): Promise<Trips.dto.GetOutput> {
		return this.provider.find({
			id: data.id,
			userId,
			tx: this.db,
		});
	}
}
