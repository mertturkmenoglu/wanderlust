import { ORPCError } from '@orpc/server';
import { eq, inArray } from 'drizzle-orm';
import type { TDatabaseService } from '@/db';
import * as schema from '@/db/schema';
import type * as dto from './dto';

export class CitiesRepository {
	constructor(private readonly db: TDatabaseService) {}

	async list() {
		try {
			return this.db.query.cities.findMany({
				orderBy: (t, { asc }) => asc(t.name),
			});
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to fetch cities',
				cause: err,
			});
		}
	}

	async listFeatured() {
		try {
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
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to fetch featured cities',
				cause: err,
			});
		}
	}

	async get(data: dto.GetInput) {
		try {
			const city = await this.db.query.cities.findFirst({
				where: (t) => eq(t.id, data.id),
			});

			if (!city) {
				throw new ORPCError('NOT_FOUND', {
					message: `City with ID ${data.id} not found`,
				});
			}

			return city;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to fetch city',
				cause: err,
			});
		}
	}

	async create(data: dto.CreateInput) {
		try {
			const [result] = await this.db
				.insert(schema.cities)
				.values(data)
				.returning();

			if (!result) {
				throw new Error('No city returned after insertion');
			}

			return result;
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create city',
				cause: err,
			});
		}
	}

	async update(data: dto.UpdateInput) {
		const { id, ...updateData } = data;
		try {
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
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update city',
				cause: err,
			});
		}
	}

	async _delete(data: dto.DeleteInput) {
		try {
			await this.db.delete(schema.cities).where(eq(schema.cities.id, data.id));
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete city',
				cause: err,
			});
		}
	}
}
