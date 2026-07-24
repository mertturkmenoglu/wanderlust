import { Tokens, Types } from '@wanderlust/common';
import type { Lists } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { os } from '../shared/router';

@injectable()
export class ListAllMethod {
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
		data: Lists.dto.ListInput,
	): Promise<Lists.dto.ListOutput> {
		const offset = Types.Pagination.getOffset(data);

		const result = await this.db.query.lists.findMany({
			where: {
				userId: userId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			offset: offset,
			limit: data.pageSize,
			with: {
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
			},
		});

		const totalRecords = await this.db.$count(
			schema.lists,
			eq(schema.lists.userId, userId),
		);

		return {
			lists: result,
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}
}
