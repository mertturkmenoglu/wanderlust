import { Pagination } from '@wanderlust/common';
import type { addresses as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { eq, ilike, or } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';

@injectable()
export class AddressesRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async create(
		_userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		const [result] = await this.db
			.insert(schema.addresses)
			.values({
				cityId: data.cityId,
				lat: data.lat,
				lng: data.lng,
				line1: data.line1,
				line2: data.line2,
				postalCode: data.postalCode,
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'Failed to create address');

		const address = await this.db.query.addresses.findFirst({
			where: {
				id: result.id,
			},
			with: {
				city: true,
			},
		});

		invariant(address, 'INTERNAL_SERVER_ERROR', 'Failed to retrieve address');

		return { address };
	}

	async list(_userId: string, data: dto.ListInput): Promise<dto.ListOutput> {
		const offset = Pagination.getOffset(data);

		const result = await this.db.query.addresses.findMany({
			where: data.query
				? {
						OR: [
							{ line1: { like: `%${data.query}%` } },
							{ line2: { like: `%${data.query}%` } },
							{ postalCode: { like: `%${data.query}%` } },
						],
					}
				: undefined,
			with: {
				city: true,
			},
			offset: offset,
			limit: data.pageSize,
			orderBy: data.sort
				? {
						[data.sort.field]: data.sort.order,
					}
				: undefined,
		});

		const totalItems = await this.db.$count(
			schema.addresses,
			or(
				ilike(schema.addresses.line1, `%${data.query}%`),
				ilike(schema.addresses.line2, `%${data.query}%`),
				ilike(schema.addresses.postalCode, `%${data.query}%`),
			),
		);

		const pagination = Pagination.compute(data, totalItems);

		return {
			addresses: result,
			pagination,
		};
	}

	async get(_userId: string, data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.db.query.addresses.findFirst({
			where: {
				id: data.id,
			},
			with: {
				city: true,
			},
		});

		invariant(result, 'NOT_FOUND', `Address with ID ${data.id} not found`);

		return { address: result };
	}

	async update(
		_userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		const { id, ...updateData } = data;

		const [result] = await this.db
			.update(schema.addresses)
			.set(updateData)
			.where(eq(schema.addresses.id, id))
			.returning();

		invariant(result, 'NOT_FOUND', `Address with ID ${id} not found`);

		const address = await this.db.query.addresses.findFirst({
			where: {
				id: result.id,
			},
			with: {
				city: true,
			},
		});

		invariant(address, 'INTERNAL_SERVER_ERROR', 'Failed to retrieve address');

		return { address };
	}

	async _delete(
		_userId: string,
		data: dto.DeleteInput,
	): Promise<dto.DeleteOutput> {
		const result = await this.db
			.delete(schema.addresses)
			.where(eq(schema.addresses.id, data.id))
			.returning();

		invariant(result.length === 1, 'NOT_FOUND', 'Address not found');

		return {};
	}
}
