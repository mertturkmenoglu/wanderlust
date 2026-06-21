import { ORPCError } from '@orpc/server';
import type { cities as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { eq, inArray } from 'drizzle-orm';
import { inject, injectable } from 'inversify';

@injectable()
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
			where: (t) =>
				inArray(t.id, [
					1106, // Salzburg
					1108, // Vienna
					1109, // Istanbul
					2300, // Athens
					3012, // Rome
					3014, // Turin
					3015, // Florence
					3016, // Venice
					4010, // Prague
					5010, // Amsterdam
					6010, // Paris
					7010, // Barcelona
				]),
			orderBy: (t, { asc }) => asc(t.name),
		});
	}

	async get(data: dto.GetInput) {
		const city = await this.db.query.cities.findFirst({
			where: (t) => eq(t.id, data.id),
		});

		if (!city) {
			throw new ORPCError('NOT_FOUND', {
				message: `City with ID ${data.id} not found`,
			});
		}

		return city;
	}

	async create(data: dto.CreateInput) {
		const [result] = await this.db
			.insert(schema.cities)
			.values(data)
			.returning();

		if (!result) {
			throw new Error('No city returned after insertion');
		}

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

		if (!result) {
			throw new Error('No city returned after update');
		}

		return result;
	}

	async _delete(data: dto.DeleteInput) {
		await this.db.delete(schema.cities).where(eq(schema.cities.id, data.id));
	}
}
