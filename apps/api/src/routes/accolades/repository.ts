import { Types } from '@wanderlust/common';
import type { Accolades } from '@wanderlust/contract';
import {
	$includes,
	DatabaseService,
	type TDatabaseService,
} from '@wanderlust/db';
import * as schema from '@wanderlust/db/schema';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { slugifyWithRandom } from '@/lib/slug';
import { TraceAll } from '@/lib/tracer';
import { findAssignments, findMany } from './statements';

@injectable()
@TraceAll()
export class AccoladesRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async create(
		_userId: string,
		data: Accolades.dto.CreateInput,
	): Promise<Accolades.dto.CreateOutput> {
		const slug = slugifyWithRandom(data.title);

		const [result] = await this.db
			.insert(schema.accolades)
			.values({
				id: slug,
				badge: data.badge,
				description: data.description,
				image: data.image,
				title: data.title,
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'Failed to create accolade');

		return { accolade: result };
	}

	async list(data: Accolades.dto.ListInput): Promise<Accolades.dto.ListOutput> {
		const offset = Types.Pagination.getOffset(data);

		const result = await findMany.execute(this.db, {
			limit: data.pageSize,
			offset: offset,
		});

		const totalItems = await this.db.$count(schema.accolades);
		const pagination = Types.Pagination.compute(data, totalItems);

		return {
			accolades: result,
			pagination: pagination,
		};
	}

	async delete(
		_userId: string,
		data: Accolades.dto.DeleteInput,
	): Promise<Accolades.dto.DeleteOutput> {
		const result = await this.db
			.delete(schema.accolades)
			.where(eq(schema.accolades.id, data.id))
			.returning();

		invariant(result.length === 1, 'NOT_FOUND', 'Accolade not found');

		return {};
	}

	async get(data: Accolades.dto.GetInput): Promise<Accolades.dto.GetOutput> {
		const accolade = await this.db.query.accolades.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(accolade, 'NOT_FOUND', 'Accolade not found');

		return { accolade };
	}

	async listPlaces(
		_userId: string | null,
		data: Accolades.dto.ListPlacesInput,
	) {
		const [size, places] = await this.findPlacesByAccoladeId(
			data.id,
			data.page,
			data.pageSize,
		);

		return {
			places,
			pagination: Types.Pagination.compute(data, size),
		};
	}

	async update(
		_userId: string,
		data: Accolades.dto.UpdateInput,
	): Promise<Accolades.dto.UpdateOutput> {
		const [updated] = await this.db
			.update(schema.accolades)
			.set({
				badge: data.badge,
				description: data.description,
				image: data.image,
				title: data.title,
			})
			.where(eq(schema.accolades.id, data.id))
			.returning();

		invariant(updated, 'NOT_FOUND', 'Accolade not found');

		return { accolade: updated };
	}

	private async findPlacesByAccoladeId(
		id: string,
		page: number,
		pageSize: number,
	) {
		const offset = Types.Pagination.getOffset({ page, pageSize });

		const assignments = await findAssignments.execute(this.db, {
			id,
		});

		const places = await this.db.query.places.findMany({
			where: {
				id: {
					in: assignments.map((aa) => aa.placeId),
				},
			},
			with: $includes.place.with,
			offset,
			limit: pageSize,
		});

		return [assignments.length, places] as const;
	}
}
