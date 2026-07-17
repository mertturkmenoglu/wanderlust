import type { Categories } from '@wanderlust/contract';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import * as schema from '@wanderlust/db/schema';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';

@injectable()
@TraceAll()
export class CategoriesRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async get(data: Categories.dto.GetInput) {
		const result = await this.db.query.categories.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(result, 'NOT_FOUND', `Category with ID ${data.id} not found`);

		return result;
	}

	async list() {
		return this.db.query.categories.findMany({
			orderBy: (t, { asc }) => asc(t.name),
		});
	}

	async create(data: Categories.dto.CreateInput) {
		const [result] = await this.db
			.insert(schema.categories)
			.values({
				id: data.id,
				name: data.name,
				image: data.image,
				description: data.description,
				displayName: data.displayName,
				attributions: data.attributions,
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'No category returned');

		return result;
	}

	async update(data: Categories.dto.UpdateInput) {
		const [result] = await this.db
			.update(schema.categories)
			.set({
				name: data.name,
				image: data.image,
			})
			.where(eq(schema.categories.id, data.id))
			.returning();

		invariant(result, 'NOT_FOUND', `Category with ID ${data.id} not found`);

		return result;
	}

	async _delete(data: Categories.dto.DeleteInput) {
		await this.db
			.delete(schema.categories)
			.where(eq(schema.categories.id, data.id));
	}
}
