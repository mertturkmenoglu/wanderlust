import { Tokens, Types } from '@wanderlust/common';
import type { Lists } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';

@injectable()
export class ListPublicMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.listPublic.handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Lists.dto.ListPublicInput,
	): Promise<Lists.dto.ListPublicOutput> {
		const offset = Types.Pagination.getOffset(data);

		const user = await this.db.query.users.findFirst({
			where: {
				username: data.username,
			},
		});

		invariant(
			user,
			'NOT_FOUND',
			`User with username '${data.username}' not found`,
		);

		const result = await this.db.query.lists.findMany({
			where: {
				userId: user.id,
				isPublic: true,
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
			and(eq(schema.lists.userId, user.id), eq(schema.lists.isPublic, true)),
		);

		return {
			lists: result,
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}
}
