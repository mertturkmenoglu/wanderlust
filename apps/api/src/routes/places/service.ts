import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Places } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { PlacesRepository } from './repository';

@injectable()
@TraceAll()
export class PlacesService {
	private readonly ns = 'places';

	constructor(
		@inject(PlacesRepository) private readonly repo: PlacesRepository,
		@inject(Tokens.Cache) private readonly cache: CacheService,
	) {}

	async get(
		data: Places.dto.GetInput,
		userId: string | null,
	): Promise<Places.dto.GetOutput> {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: data.id,
			ttl: '1h',
			factory: async () => this.repo.get(data),
			grace: '5m',
		});

		if (userId === null) {
			return {
				place: result,
				meta: {
					isBookmarked: false,
					isFavorite: false,
				},
			};
		}

		const meta = await this.repo.getMeta(data.id, userId);

		return {
			place: result,
			meta: meta,
		};
	}

	async list(): Promise<Places.dto.ListOutput> {
		const result = await this.repo.list();

		return {
			places: result,
		};
	}

	async update(data: Places.dto.UpdateInput): Promise<Places.dto.UpdateOutput> {
		const result = await this.repo.update(data);

		return {
			place: result,
		};
	}

	async _delete(data: Places.dto.DeleteInput): Promise<void> {
		await this.repo._delete(data);
	}
}
