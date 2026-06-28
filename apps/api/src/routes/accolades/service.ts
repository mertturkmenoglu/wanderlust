import type { accolades as dto } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { AccoladesRepository } from './repository';

@injectable()
export class AccoladesService {
	constructor(
		@inject(AccoladesRepository)
		private readonly accoladesRepository: AccoladesRepository,
	) {}

	async create(
		userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		const result = await this.accoladesRepository.create(userId, data);

		return result;
	}

	async list(data: dto.ListInput): Promise<dto.ListOutput> {
		const result = await this.accoladesRepository.list(data);

		return result;
	}

	async _delete(
		userId: string,
		data: dto.DeleteInput,
	): Promise<dto.DeleteOutput> {
		await this.accoladesRepository._delete(userId, data);

		return {};
	}

	async get(data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.accoladesRepository.get(data);

		return result;
	}

	async getPlaces(userId: string | null, data: dto.GetPlacesInput): Promise<dto.GetPlacesOutput> {
		const result = await this.accoladesRepository.getPlaces(userId, data);

		return result;
	}

	async update(
		userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		const result = await this.accoladesRepository.update(userId, data);

		return result;
	}
}
