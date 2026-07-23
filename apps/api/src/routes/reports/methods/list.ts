import { Tokens, Types } from '@wanderlust/common';
import type { Reports } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../shared/router';

@injectable()
export class ListReportsMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.list.use(isAdmin).handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Reports.dto.ListInput,
	): Promise<Reports.dto.ListOutput> {
		const offset = Types.Pagination.getOffset(data);

		const result = await this.db.query.reports.findMany({
			orderBy: (t, { desc }) => [desc(t.createdAt)],
			offset,
			limit: data.pageSize,
		});

		const totalRecords = await this.db.$count(schema.reports);

		return {
			reports: result,
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}
}
