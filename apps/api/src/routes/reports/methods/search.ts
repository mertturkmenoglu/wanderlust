import { Tokens, Types } from '@wanderlust/common';
import type { Reports } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { count, desc, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../shared/router';

@injectable()
export class SearchReportsMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.search.use(isAdmin).handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Reports.dto.SearchInput,
	): Promise<Reports.dto.SearchOutput> {
		const offset = Types.Pagination.getOffset(data);

		// Query builder and count query builder
		let qb = this.db.select().from(schema.reports).$dynamic();
		let cqb = this.db
			.select({ count: count() })
			.from(schema.reports)
			.$dynamic();

		// Apply filters
		if (data.reason) {
			qb = qb.where(eq(schema.reports.reason, data.reason));
			cqb = cqb.where(eq(schema.reports.reason, data.reason));
		}

		if (data.reporterId) {
			qb = qb.where(eq(schema.reports.reporterId, data.reporterId));
			cqb = cqb.where(eq(schema.reports.reporterId, data.reporterId));
		}

		if (data.resourceType) {
			qb = qb.where(eq(schema.reports.resourceType, data.resourceType));
			cqb = cqb.where(eq(schema.reports.resourceType, data.resourceType));
		}

		if (data.resolved !== undefined) {
			qb = qb.where(eq(schema.reports.resolved, data.resolved));
			cqb = cqb.where(eq(schema.reports.resolved, data.resolved));
		}

		const reports = await qb
			.orderBy(desc(schema.reports.createdAt))
			.limit(data.pageSize)
			.offset(offset);

		const totalRecords = await cqb;

		return {
			reports,
			pagination: Types.Pagination.compute(data, totalRecords[0]?.count ?? 0),
		};
	}
}
