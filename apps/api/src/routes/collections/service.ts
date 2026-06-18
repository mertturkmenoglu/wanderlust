import { inject, injectable } from 'inversify';
import type * as dto from './dto';
import { CollectionsRepository } from './repository';

@injectable()
export class CollectionsService {
	constructor(
		@inject(CollectionsRepository) private readonly repo: CollectionsRepository,
	) { }

	async list(data: dto.ListInput): Promise<dto.ListOutput> {
		const result = await this.repo.list(data);

		return {
			collections: result.collections,
			pagination: result.pagination,
		};
	}

	async get(userId: string | null, data: dto.GetInput): Promise<dto.GetOutput> {
		const collection = await this.repo.getById(userId, data);

		return {
			collection,
		};
	}

	async create(data: dto.CreateInput): Promise<dto.CreateOutput> {
		const collection = await this.repo.create(data);

		return {
			collection,
		};
	}

	async _delete(data: dto.DeleteInput): Promise<void> {
		await this.repo._delete(data);
	}

	async update(data: dto.UpdateInput): Promise<dto.UpdateOutput> {
		const collection = await this.repo.update(data);

		return {
			collection,
		};
	}

	async appendItem(data: dto.AppendItemInput): Promise<dto.AppendItemOutput> {
		const item = await this.repo.appendItem(data);

		return {
			collectionItem: item,
		};
	}

	async removeItem(data: dto.RemoveItemInput): Promise<dto.RemoveItemOutput> {
		await this.repo.removeItem(data);

		return {};
	}

	async reorderItems(
		userId: string,
		data: dto.ReorderItemsInput,
	): Promise<dto.ReorderItemsOutput> {
		const collection = await this.repo.reorderItems(userId, data);

		return {
			collection,
		};
	}

	async createPlaceRelation(
		data: dto.CreatePlaceRelationInput,
	): Promise<dto.CreatePlaceRelationOutput> {
		await this.repo.createPlaceRelation(data);

		return {};
	}

	async deletePlaceRelation(
		data: dto.DeletePlaceRelationInput,
	): Promise<dto.DeletePlaceRelationOutput> {
		await this.repo.deletePlaceRelation(data);

		return {};
	}

	async createCityRelation(
		data: dto.CreateCityRelationInput,
	): Promise<dto.CreateCityRelationOutput> {
		await this.repo.createCityRelation(data);

		return {};
	}

	async deleteCityRelation(
		data: dto.DeleteCityRelationInput,
	): Promise<dto.DeleteCityRelationOutput> {
		await this.repo.deleteCityRelation(data);

		return {};
	}

	async listByPlaceId(
		userId: string | null,
		data: dto.ListByPlaceIdInput,
	): Promise<dto.ListByPlaceIdOutput> {
		const result = await this.repo.listByPlaceId(userId, data);

		return {
			collections: result.collections,
		};
	}

	async listByCityId(
		userId: string | null,
		data: dto.ListByCityIdInput,
	): Promise<dto.ListByCityIdOutput> {
		const result = await this.repo.listByCityId(userId, data);

		return {
			collections: result.collections,
		};
	}

	async listAllPlaceCollections(
		data: dto.ListAllPlaceCollectionsInput,
	): Promise<dto.ListAllPlaceCollectionsOutput> {
		const result = await this.repo.listAllPlaceCollections(data);

		return {
			relations: result.relations,
			pagination: result.pagination,
		};
	}

	async listAllCityCollections(
		data: dto.ListAllCityCollectionsInput,
	): Promise<dto.ListAllCityCollectionsOutput> {
		const result = await this.repo.listAllCityCollections(data);

		return {
			relations: result.relations,
			pagination: result.pagination,
		};
	}
}
