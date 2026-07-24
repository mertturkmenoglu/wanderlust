import { Tokens } from '@wanderlust/common';
import type { Lists } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { ListProvider } from '../provides/list';
import { os } from '../shared/router';

@injectable()
export class GetListMethod {
	constructor(
		@inject(ListProvider) private readonly listProvider: ListProvider,
		@inject(Tokens.Database) private readonly db: DatabaseService,
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
		data: Lists.dto.GetInput,
	): Promise<Lists.dto.GetOutput> {
		return this.listProvider.find({
			tx: this.db,
			userId: userId,
			listId: data.id,
		});
	}
}
