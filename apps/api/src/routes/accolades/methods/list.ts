import { Tokens, Types } from '@wanderlust/common';
import type { Accolades } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';
import { os } from '../shared/router';

@injectable()
export class ListAccoladesMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.list.handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Accolades.dto.ListInput,
	): Promise<Accolades.dto.ListOutput> {
		const offset = Types.Pagination.getOffset(data);

		const result = await findMany.execute(this.db, {
			limit: data.pageSize,
			offset: offset,
		});

		const totalItems = await this.db.$count(schema.accolades);
		const pagination = Types.Pagination.compute(data, totalItems);

		return {
			accolades: result,
			pagination: pagination,
		};
	}
}

export const findMany = definePreparedStatement({
	schema: z.object({
		offset: z.int(),
		limit: z.int(),
	}),
	statement: (db) => {
		return db.query.accolades
			.findMany({
				orderBy: {
					title: 'asc',
					createdAt: 'asc',
				},
				offset: sql.placeholder('offset'),
				limit: sql.placeholder('limit'),
			})
			.prepare('accolades_find_many');
	},
});
