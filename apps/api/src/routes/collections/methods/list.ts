import { Tokens, Types } from '@wanderlust/common';
import type { Collections } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { transformFiltersToConditions } from '@/lib/filters-to-conditions';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../shared/router';

@injectable()
export class ListCollectionsMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.list
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await this.execute(input);

				return result;
			});
	}

	private async execute(
		data: Collections.dto.ListInput,
	): Promise<Collections.dto.ListOutput> {
		const offset = Types.Pagination.getOffset(data);
		const sortBy = data.sort?.field ?? 'createdAt';
		const filters = data.filter?.filters ?? [];

		const result = await this.db.query.collections.findMany({
			where: {
				OR: transformFiltersToConditions(filters),
			},
			orderBy: {
				[sortBy]: data.sort?.order ?? 'desc',
			},
			offset,
			limit: data.pageSize,
		});

		const totalRecords = await this.db.$count(schema.collections);

		return {
			collections: result,
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}
}
