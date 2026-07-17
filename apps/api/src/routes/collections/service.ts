import type { Collections } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { CollectionsRepository } from './repository';

@injectable()
@TraceAll()
export class CollectionsService {
	constructor(
		@inject(CollectionsRepository) private readonly repo: CollectionsRepository,
	) {}

	async list(
		userId: string,
		data: Collections.dto.ListInput,
	): Promise<Collections.dto.ListOutput> {
		const result = await this.repo.list(userId, data);

		return result;
	}

	async get(
		userId: string | null,
		data: Collections.dto.GetInput,
	): Promise<Collections.dto.GetOutput> {
		const result = await this.repo.getById(userId, data);

		return result;
	}

	async create(
		userId: string,
		data: Collections.dto.CreateInput,
	): Promise<Collections.dto.CreateOutput> {
		const result = await this.repo.create(userId, data);

		return result;
	}

	async delete(
		userId: string,
		data: Collections.dto.DeleteInput,
	): Promise<Collections.dto.DeleteOutput> {
		const result = await this.repo.delete(userId, data);

		return result;
	}

	async update(
		userId: string,
		data: Collections.dto.UpdateInput,
	): Promise<Collections.dto.UpdateOutput> {
		const result = await this.repo.update(userId, data);

		return result;
	}

	async updateItems(
		userId: string,
		data: Collections.dto.ItemsUpdateInput,
	): Promise<Collections.dto.ItemsUpdateOutput> {
		const result = await this.repo.updateItems(userId, data);

		return result;
	}

	async listCollectionsForPlace(
		userId: string | null,
		data: Collections.dto.PlacesListInput,
	): Promise<Collections.dto.PlacesListOutput> {
		const result = await this.repo.listCollectionsForPlace(userId, data);

		return result;
	}

	async updateCollectionsForPlace(
		userId: string,
		data: Collections.dto.PlacesUpdateInput,
	): Promise<Collections.dto.PlacesUpdateOutput> {
		const result = await this.repo.updateCollectionsForPlace(userId, data);

		return result;
	}

	async listCollectionsForCity(
		userId: string | null,
		data: Collections.dto.CitiesListInput,
	): Promise<Collections.dto.CitiesListOutput> {
		const result = await this.repo.listCollectionsForCity(userId, data);

		return result;
	}

	async updateCollectionsForCity(
		userId: string,
		data: Collections.dto.CitiesUpdateInput,
	): Promise<Collections.dto.CitiesUpdateOutput> {
		const result = await this.repo.updateCollectionsForCity(userId, data);

		return result;
	}

	async listPlacesForCollection(
		userId: string,
		data: Collections.dto.RelationsPlacesInput,
	): Promise<Collections.dto.RelationsPlacesOutput> {
		const result = await this.repo.listPlacesForCollection(userId, data);

		return result;
	}

	async listCitiesForCollection(
		userId: string,
		data: Collections.dto.RelationsCitiesInput,
	): Promise<Collections.dto.RelationsCitiesOutput> {
		const result = await this.repo.listCitiesForCollection(userId, data);

		return result;
	}
}
