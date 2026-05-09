import { ORPCError } from '@orpc/client';
import { count, desc, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { DatabaseService, type TDatabaseService } from '@/db';
import * as schema from '@/db/schema';
import { Pagination } from '@/lib/pagination';
import { nanoid } from '@/lib/uid';
import type * as dto from './dto';

@injectable()
export class ReportsRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	private async isAdmin(userId: string): Promise<boolean> {
		const admin = await this.db.query.admins.findFirst({
			where: (admins, { eq }) => eq(admins.userId, userId),
		});

		return !!admin;
	}

	async get(userId: string, data: dto.GetInput) {
		try {
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to get report',
				cause: err,
			});
		}
	}

	async list(data: dto.ListInput) {
		const offset = Pagination.getOffset(data);

		try {
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list reports',
				cause: err,
			});
		}
	}

	async search(data: dto.SearchInput) {
		const offset = Pagination.getOffset(data);

		try {
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to search reports',
				cause: err,
			});
		}
	}

	async create(userId: string, data: dto.CreateInput) {
		try {
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create report',
				cause: err,
			});
		}
	}

	async update(data: dto.UpdateInput) {
		try {
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update report',
				cause: err,
			});
		}
	}

	async _delete(data: dto.DeleteInput) {
		try {
			const result = await this.db
				.delete(schema.reports)
				.where(eq(schema.reports.id, data.id));

			if (result.rowCount !== 1) {
				throw new ORPCError('NOT_FOUND', {
					message: `Report with id ${data.id} not found`,
				});
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete report',
				cause: err,
			});
		}
	}
}
