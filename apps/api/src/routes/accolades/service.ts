import type { Accolades } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { AccoladesRepository } from './repository';

@injectable()
@TraceAll()
export class AccoladesService {
	constructor(
		@inject(AccoladesRepository)
		private readonly accoladesRepository: AccoladesRepository,
	) {}

	async create(
		userId: string,
		data: Accolades.dto.CreateInput,
	): Promise<Accolades.dto.CreateOutput> {
		const result = await this.accoladesRepository.create(userId, data);

		return result;
	}

	async list(data: Accolades.dto.ListInput): Promise<Accolades.dto.ListOutput> {
		const result = await this.accoladesRepository.list(data);

		return result;
	}

	async _delete(
		userId: string,
		data: Accolades.dto.DeleteInput,
	): Promise<Accolades.dto.DeleteOutput> {
		await this.accoladesRepository._delete(userId, data);

		return {};
	}

	async get(data: Accolades.dto.GetInput): Promise<Accolades.dto.GetOutput> {
		const result = await this.accoladesRepository.get(data);

		return result;
	}

	async listPlaces(
		userId: string | null,
		data: Accolades.dto.ListPlacesInput,
	): Promise<Accolades.dto.ListPlacesOutput> {
		const result = await this.accoladesRepository.listPlaces(userId, data);

		return result;
	}

	async update(
		userId: string,
		data: Accolades.dto.UpdateInput,
	): Promise<Accolades.dto.UpdateOutput> {
		const result = await this.accoladesRepository.update(userId, data);

		return result;
	}
}
