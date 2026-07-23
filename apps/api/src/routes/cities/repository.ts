import { Tokens } from '@wanderlust/common';
import type { Cities } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';
import { findById, findMany } from './statements';

@injectable()
@TraceAll()
export class CitiesRepository {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	async list() {
		return findMany.execute(this.db, {});
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

	async get(data: Cities.dto.GetInput) {
		const city = await findById.execute(this.db, { id: data.id });

		invariant(city, 'NOT_FOUND', `City with ID ${data.id} not found`);

		return city;
	}

	async create(data: Cities.dto.CreateInput) {
		const [result] = await this.db
			.insert(schema.cities)
			.values(data)
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'No city returned');

		return result;
	}

	async update(data: Cities.dto.UpdateInput) {
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

	async delete(data: Cities.dto.DeleteInput) {
		await this.db.delete(schema.cities).where(eq(schema.cities.id, data.id));
	}
}
