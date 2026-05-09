import { inject, injectable } from 'inversify';
import type * as dto from './dto';
import { FavoritesRepository } from './repository';

@injectable()
export class FavoritesService {
	constructor(@inject(FavoritesRepository) private readonly repo: FavoritesRepository) { }

	async create(
		userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		const result = await this.repo.create(userId, data);

		return {
			favorite: result,
		};
	}

	async list(userId: string, data: dto.ListInput): Promise<dto.ListOutput> {
		const result = await this.repo.list(userId, data);

		return {
			favorites: result.favorites,
			pagination: result.pagination,
		};
	}

	async _delete(
		userId: string,
		data: dto.DeleteInput,
	): Promise<dto.DeleteOutput> {
		await this.repo._delete(userId, data);

		return {};
	}

	async listByUsername(
		data: dto.ListByUsernameInput,
	): Promise<dto.ListByUsernameOutput> {
		const result = await this.repo.listByUsername(data);

		return {
			favorites: result.favorites,
			pagination: result.pagination,
		};
	}
}
