import { ORPCError } from '@orpc/server';
import * as schema from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { DatabaseService, type TDatabaseService } from '@/lib/db';
import type * as dto from './dto';

@injectable()
export class CategoriesRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async list() {
		try {
			return this.db.query.categories.findMany({
				orderBy: (t, { asc }) => asc(t.name),
			});
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to fetch categories',
				cause: err,
			});
		}
	}

	async create(data: dto.CreateInput) {
		try {
			const [result] = await this.db
				.insert(schema.categories)
				.values({
					id: data.id,
					name: data.name,
					image: data.image,
				})
				.returning();

			if (!result) {
				throw new Error('No category returned after insertion');
			}

			return result;
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create category',
				cause: err,
			});
		}
	}

	async update(data: dto.UpdateInput) {
		try {
			const [result] = await this.db
				.update(schema.categories)
				.set({
					name: data.name,
					image: data.image,
				})
				.where(eq(schema.categories.id, data.id))
				.returning();

			if (!result) {
				throw new Error('No category returned after update');
			}

			return result;
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update category',
				cause: err,
			});
		}
	}

	async _delete(data: dto.DeleteInput) {
		try {
			await this.db
				.delete(schema.categories)
				.where(eq(schema.categories.id, data.id));
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete category',
				cause: err,
			});
		}
	}
}
