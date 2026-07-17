import type { Favorites } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { TraceAll } from '@/lib/tracer';
import { FavoritesRepository } from './repository';

@injectable()
@TraceAll()
export class FavoritesService {
	constructor(
		@inject(FavoritesRepository) private readonly repo: FavoritesRepository,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
	) {}

	async create(
		userId: string,
		username: string,
		data: Favorites.dto.CreateInput,
	): Promise<Favorites.dto.CreateOutput> {
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

	async list(
		userId: string,
		data: Favorites.dto.ListInput,
	): Promise<Favorites.dto.ListOutput> {
		const result = await this.repo.list(userId, data);

		return {
			favorites: result.favorites,
			pagination: result.pagination,
		};
	}

	async _delete(
		userId: string,
		data: Favorites.dto.DeleteInput,
	): Promise<Favorites.dto.DeleteOutput> {
		await this.repo._delete(userId, data);

		return {};
	}

	async listByUsername(
		data: Favorites.dto.ListByUsernameInput,
	): Promise<Favorites.dto.ListByUsernameOutput> {
		const result = await this.repo.listByUsername(data);

		return {
			favorites: result.favorites,
			pagination: result.pagination,
		};
	}
}
