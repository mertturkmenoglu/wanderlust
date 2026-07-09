import type { collections as dto } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { CollectionsRepository } from './repository';

@injectable()
@TraceAll()
export class CollectionsService {
	constructor(
		@inject(CollectionsRepository) private readonly repo: CollectionsRepository,
	) {}

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
		data: dto.ItemsAppendInput,
	): Promise<dto.ItemsAppendOutput> {
		const result = await this.repo.appendItem(userId, data);

		return result;
	}

	async removeItem(
		userId: string,
		data: dto.ItemsRemoveInput,
	): Promise<dto.ItemsRemoveOutput> {
		const result = await this.repo.removeItem(userId, data);

		return result;
	}

	async reorderItems(
		userId: string,
		data: dto.ItemsReorderInput,
	): Promise<dto.ItemsReorderOutput> {
		const result = await this.repo.reorderItems(userId, data);

		return result;
	}

	async listCollectionsForPlace(
		userId: string | null,
		data: dto.PlacesListInput,
	): Promise<dto.PlacesListOutput> {
		const result = await this.repo.listCollectionsForPlace(userId, data);

		return result;
	}

	async appendCollectionToPlace(
		userId: string,
		data: dto.PlacesAppendInput,
	): Promise<dto.PlacesAppendOutput> {
		const result = await this.repo.appendCollectionToPlace(userId, data);

		return result;
	}

	async reorderCollectionsForPlace(
		userId: string,
		data: dto.PlacesReorderInput,
	): Promise<dto.PlacesReorderOutput> {
		const result = await this.repo.reorderCollectionsForPlace(userId, data);

		return result;
	}

	async removeCollectionFromPlace(
		userId: string,
		data: dto.PlacesRemoveInput,
	): Promise<dto.PlacesRemoveOutput> {
		const result = await this.repo.removeCollectionFromPlace(userId, data);

		return result;
	}

	async listCollectionsForCity(
		userId: string | null,
		data: dto.CitiesListInput,
	): Promise<dto.CitiesListOutput> {
		const result = await this.repo.listCollectionsForCity(userId, data);

		return result;
	}

	async appendCollectionToCity(
		userId: string,
		data: dto.CitiesAppendInput,
	): Promise<dto.CitiesAppendOutput> {
		const result = await this.repo.appendCollectionToCity(userId, data);

		return result;
	}

	async reorderCollectionsForCity(
		userId: string,
		data: dto.CitiesReorderInput,
	): Promise<dto.CitiesReorderOutput> {
		const result = await this.repo.reorderCollectionsForCity(userId, data);

		return result;
	}

	async removeCollectionFromCity(
		userId: string,
		data: dto.CitiesRemoveInput,
	): Promise<dto.CitiesRemoveOutput> {
		const result = await this.repo.removeCollectionFromCity(userId, data);

		return result;
	}

	async listPlacesForCollection(
		userId: string,
		data: dto.RelationsPlacesInput,
	): Promise<dto.RelationsPlacesOutput> {
		const result = await this.repo.listPlacesForCollection(userId, data);

		return result;
	}

	async listCitiesForCollection(
		userId: string,
		data: dto.RelationsCitiesInput,
	): Promise<dto.RelationsCitiesOutput> {
		const result = await this.repo.listCitiesForCollection(userId, data);

		return result;
	}
}
