import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import type * as dto from './dto';

@injectable()
export class CategoriesRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async list() {
		return this.db.query.categories.findMany({
			orderBy: (t, { asc }) => asc(t.name),
		});
	}

	async create(data: dto.CreateInput) {
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
	}

	async update(data: dto.UpdateInput) {
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
	}

	async _delete(data: dto.DeleteInput) {
		await this.db
			.delete(schema.categories)
			.where(eq(schema.categories.id, data.id));
	}
}
