import { ORPCError } from '@orpc/client';
import { Pagination } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { count, desc, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import type * as dto from './dto';

@injectable()
export class ReportsRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	private async isAdmin(userId: string): Promise<boolean> {
		const user = await this.db.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, userId),
		});

		return user?.role === 'admin';
	}

	async get(userId: string, data: dto.GetInput) {
		const report = await this.db.query.reports.findFirst({
			where: (reports, { eq }) => eq(reports.id, data.id),
		});

		if (!report) {
			throw new ORPCError('NOT_FOUND', {
				message: `Report with id ${data.id} not found`,
			});
		}

		if (report.reporterId !== userId) {
			const isAdmin = await this.isAdmin(userId);

			if (!isAdmin) {
				throw new ORPCError('FORBIDDEN', {
					message: 'You do not have permission to access this report',
				});
			}
		}

		return report;
	}

	async list(data: dto.ListInput) {
		const offset = Pagination.getOffset(data);

		const result = await this.db.query.reports.findMany({
			orderBy: (t, { desc }) => [desc(t.createdAt)],
			offset,
			limit: data.pageSize,
		});

		const totalRecords = await this.db.$count(schema.reports);

		return {
			reports: result,
			pagination: Pagination.compute(data, totalRecords),
		};
	}

	async search(data: dto.SearchInput) {
		const offset = Pagination.getOffset(data);

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
			pagination: Pagination.compute(data, totalRecords[0]?.count ?? 0),
		};
	}

	async create(userId: string, data: dto.CreateInput) {
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

		if (!report) {
			throw new Error('Insertion failed, no report returned');
		}

		return report;
	}

	async update(data: dto.UpdateInput) {
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

		if (!report) {
			throw new ORPCError('NOT_FOUND', {
				message: `Report with id ${data.id} not found`,
			});
		}

		return report;
	}

	async _delete(data: dto.DeleteInput) {
		const result = await this.db
			.delete(schema.reports)
			.where(eq(schema.reports.id, data.id));

		if (result.rowCount !== 1) {
			throw new ORPCError('NOT_FOUND', {
				message: `Report with id ${data.id} not found`,
			});
		}
	}
}
