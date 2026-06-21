import type { favorites as dto } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { FavoritesRepository } from './repository';

@injectable()
export class FavoritesService {
	constructor(
		@inject(FavoritesRepository) private readonly repo: FavoritesRepository,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
	) { }

	async create(
		userId: string,
		username: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		const [insertResult, place] = await this.repo.create(userId, data);

		await this.activities.addActivity(username, 'create_favorite', {
			place: {
				id: place.id,
				name: place.name,
			},
		});

		return {
			favorite: insertResult,
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
