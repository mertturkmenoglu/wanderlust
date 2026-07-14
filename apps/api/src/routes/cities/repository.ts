import type { cities as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';

@injectable()
@TraceAll()
export class CitiesRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async list() {
		return this.db.query.cities.findMany({
			orderBy: (t, { asc }) => asc(t.name),
		});
	}

	async listFeatured() {
		return this.db.query.cities.findMany({
			where: {
				id: {
					in: [
						'salzburg',
						'vienna',
						'istanbul',
						'athens',
						'rome',
						'turin',
						'florence',
						'venice',
						'prague',
						'amsterdam',
						'paris',
						'barcelona',
					],
				},
			},
			orderBy: {
				name: 'asc',
			},
		});
	}

	async get(data: dto.GetInput) {
		const city = await this.db.query.cities.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(city, 'NOT_FOUND', `City with ID ${data.id} not found`);

		return city;
	}

	async create(data: dto.CreateInput) {
		const [result] = await this.db
			.insert(schema.cities)
			.values(data)
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'No city returned');

		return result;
	}

	async update(data: dto.UpdateInput) {
		const { id, ...updateData } = data;
		const [result] = await this.db
			.update(schema.cities)
			.set({
				...updateData,
			})
			.where(eq(schema.cities.id, id))
			.returning();

		invariant(result, 'NOT_FOUND', `City with ID ${id} not found`);

		return result;
	}

	async _delete(data: dto.DeleteInput) {
		await this.db.delete(schema.cities).where(eq(schema.cities.id, data.id));
	}
}
