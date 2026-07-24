import { Tokens } from '@wanderlust/common';
import type { Lists } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { os } from '../shared/router';

@injectable()
export class ListPlaceSaveStatMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.listPlaceSaveStat.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Lists.dto.ListPlaceSaveStatInput,
	): Promise<Lists.dto.ListPlaceSaveStatOutput> {
		const listIds = await this.db.query.lists.findMany({
			where: {
				userId: userId,
			},
			columns: {
				id: true,
				name: true,
			},
		});

		const statuses = await this.db.query.listItems.findMany({
			where: {
				placeId: data.placeId,
				listId: {
					in: listIds.map((l) => l.id),
				},
			},
			columns: {
				listId: true,
			},
		});

		const mapped = listIds.map((l) => ({
			id: l.id,
			name: l.name,
			includes: statuses.some((s) => s.listId === l.id),
		}));

		return {
			statuses: mapped,
		};
	}
}
