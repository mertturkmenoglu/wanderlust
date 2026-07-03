import type { addresses as dto } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { AddressesRepository } from './repository';

@injectable()
export class AddressesService {
	constructor(
		@inject(AddressesRepository) private readonly repo: AddressesRepository,
	) {}

	async create(
		userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		const result = await this.repo.create(userId, data);

		return result;
	}

	async list(userId: string, data: dto.ListInput): Promise<dto.ListOutput> {
		const result = await this.repo.list(userId, data);

		return result;
	}

	async _delete(
		userId: string,
		data: dto.DeleteInput,
	): Promise<dto.DeleteOutput> {
		await this.repo._delete(userId, data);

		return {};
	}

	async get(userId: string, data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.repo.get(userId, data);

		return result;
	}

	async update(
		userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		const result = await this.repo.update(userId, data);

		return result;
	}
}
