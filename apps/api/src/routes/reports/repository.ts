import { Tokens, Types } from '@wanderlust/common';
import type { Reports } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { count, desc, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';

@injectable()
@TraceAll()
export class ReportsRepository {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	private async isAdmin(userId: string): Promise<boolean> {
		const user = await this.db.query.users.findFirst({
			where: {
				id: userId,
			},
		});

		return user?.role === 'admin';
	}

	async get(userId: string, data: Reports.dto.GetInput) {
		const report = await this.db.query.reports.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(report, 'NOT_FOUND', `Report with id ${data.id} not found`);

		if (report.reporterId !== userId) {
			const isAdmin = await this.isAdmin(userId);

			invariant(
				isAdmin,
				'FORBIDDEN',
				'You do not have permission to access this report',
			);
		}

		return report;
	}

	async list(data: Reports.dto.ListInput) {
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

	async search(data: Reports.dto.SearchInput) {
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

	async create(userId: string, data: Reports.dto.CreateInput) {
		const [report] = await this.db
			.insert(schema.reports)
			.values({
				reporterId: userId,
				resourceId: data.resourceId,
				resourceType: data.resourceType,
				reason: data.reason,
				description: data.description,
				id: nanoid(),
			})
			.returning();

		invariant(report, 'INTERNAL_SERVER_ERROR', 'No report item returned');

		return report;
	}

	async update(data: Reports.dto.UpdateInput) {
		const [report] = await this.db
			.update(schema.reports)
			.set({
				description: data.description,
				reason: data.reason,
				resolved: data.resolved,
				resolvedAt: data.resolved ? new Date() : null,
			})
			.where(eq(schema.reports.id, data.id))
			.returning();

		invariant(report, 'NOT_FOUND', `Report with id ${data.id} not found`);

		return report;
	}

	async _delete(data: Reports.dto.DeleteInput) {
		const result = await this.db
			.delete(schema.reports)
			.where(eq(schema.reports.id, data.id));

		invariant(
			result.rowCount === 1,
			'NOT_FOUND',
			`Report with id ${data.id} not found`,
		);
	}
}
