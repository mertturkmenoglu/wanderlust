import { CacheService, type TCacheService } from '@wanderlust/cache';
import type { collections as dto } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { CollectionsRepository } from './repository';

@injectable()
@TraceAll()
export class CollectionsService {
	private readonly cache: TCacheService;
	private readonly ns = 'collections';

	constructor(
		@inject(CollectionsRepository) private readonly repo: CollectionsRepository,
		@inject(CacheService) cache: CacheService,
	) {
		this.cache = cache.get();
	}

	async list(userId: string, data: dto.ListInput): Promise<dto.ListOutput> {
		const result = await this.repo.list(userId, data);

		return result;
	}

	async get(userId: string | null, data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.repo.getById(userId, data);

		return result;
	}

	async create(
		userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		const result = await this.repo.create(userId, data);

		return result;
	}

	async _delete(
		userId: string,
		data: dto.DeleteInput,
	): Promise<dto.DeleteOutput> {
		const result = await this.repo._delete(userId, data);

		return result;
	}

	async update(
		userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		const result = await this.repo.update(userId, data);

		return result;
	}

	async appendItem(
		userId: string,
		data: dto.AppendItemInput,
	): Promise<dto.AppendItemOutput> {
		const result = await this.repo.appendItem(userId, data);

		return result;
	}

	async removeItem(
		userId: string,
		data: dto.RemoveItemInput,
	): Promise<dto.RemoveItemOutput> {
		const result = await this.repo.removeItem(userId, data);

		return result;
	}

	async reorderItems(
		userId: string,
		data: dto.ReorderItemsInput,
	): Promise<dto.ReorderItemsOutput> {
		const result = await this.repo.reorderItems(userId, data);

		return result;
	}

	async createPlaceRelation(
		userId: string,
		data: dto.CreateCollectionPlaceRelationInput,
	): Promise<dto.CreateCollectionPlaceRelationOutput> {
		const result = await this.repo.createPlaceRelation(userId, data);

		return result;
	}

	async deletePlaceRelation(
		userId: string,
		data: dto.DeleteCollectionPlaceRelationInput,
	): Promise<dto.DeleteCollectionPlaceRelationOutput> {
		const result = await this.repo.deletePlaceRelation(userId, data);

		return result;
	}

	async createCityRelation(
		userId: string,
		data: dto.CreateCollectionCityRelationInput,
	): Promise<dto.CreateCollectionCityRelationOutput> {
		const result = await this.repo.createCityRelation(userId, data);

		return result;
	}

	async deleteCityRelation(
		userId: string,
		data: dto.DeleteCollectionCityRelationInput,
	): Promise<dto.DeleteCollectionCityRelationOutput> {
		const result = await this.repo.deleteCityRelation(userId, data);

		return result;
	}

	async listByPlace(
		userId: string | null,
		data: dto.ListByPlaceInput,
	): Promise<dto.ListByPlaceOutput> {
		const result = await this.repo.listByPlace(userId, data);

		return {
			collections: result.collections,
		};
	}

	async listByCity(
		userId: string | null,
		data: dto.ListByCityInput,
	): Promise<dto.ListByCityOutput> {
		const result = await this.cache.namespace('collections').getOrSet({
			key: `city:${data.cityId}`,
			factory: async () => this.repo.listByCity(userId, data),
			ttl: '1h',
			grace: '5m',
		});

		return {
			collections: result.collections,
		};
	}

	async getCollectionPlaceRelation(
		userId: string | null,
		data: dto.GetCollectionPlaceRelationInput,
	): Promise<dto.GetCollectionPlaceRelationOutput> {
		const result = await this.repo.getCollectionPlaceRelation(userId, data);

		return result;
	}

	async listCollectionPlaceRelations(
		userId: string | null,
		data: dto.ListCollectionPlaceRelationsInput,
	): Promise<dto.ListCollectionPlaceRelationsOutput> {
		const result = await this.repo.listCollectionPlaceRelations(userId, data);

		return result;
	}

	async getCollectionCityRelation(
		userId: string | null,
		data: dto.GetCollectionCityRelationInput,
	): Promise<dto.GetCollectionCityRelationOutput> {
		const result = await this.repo.getCollectionCityRelation(userId, data);

		return result;
	}

	async listCollectionCityRelations(
		userId: string | null,
		data: dto.ListCollectionCityRelationsInput,
	): Promise<dto.ListCollectionCityRelationsOutput> {
		const result = await this.repo.listCollectionCityRelations(userId, data);

		return result;
	}
}
