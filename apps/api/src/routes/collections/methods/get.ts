import { Tokens } from '@wanderlust/common';
import type { Collections } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserId } from '@/lib/get-user-id';
import { os } from '../internal/router';
import { CollectionProvider } from '../provides/collection';

@injectable()
export class GetCollectionMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(CollectionProvider) private readonly provider: CollectionProvider,
	) {}

	route() {
		return os.get.handler(async ({ context, input }) => {
			const userId = getUserId(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string | null,
		data: Collections.dto.GetInput,
	): Promise<Collections.dto.GetOutput> {
		return this.provider.find({
			id: data.id,
			userId,
			tx: this.db,
		});
	}
}
