import { CacheService, type TCacheService } from '@wanderlust/cache';
import type { Places } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { PlacesRepository } from './repository';

@injectable()
@TraceAll()
export class PlacesService {
	private readonly ns = 'places';
	private readonly cache: ReturnType<TCacheService['namespace']>;

	constructor(
		@inject(PlacesRepository) private readonly repository: PlacesRepository,
		@inject(CacheService) cacheService: CacheService,
	) {
		this.cache = cacheService.get().namespace(this.ns);
	}

	async get(
		data: Places.dto.GetInput,
		userId: string | null,
	): Promise<Places.dto.GetOutput> {
		const result = await this.cache.getOrSet({
			key: data.id,
			ttl: '1h',
			factory: async () => this.repository.get(data),
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

		const meta = await this.repository.getMeta(data.id, userId);

		return {
			place: result,
			meta: meta,
		};
	}

	async list(): Promise<Places.dto.ListOutput> {
		const result = await this.repository.list();

		return {
			places: result,
		};
	}

	async update(data: Places.dto.UpdateInput): Promise<Places.dto.UpdateOutput> {
		const result = await this.repository.update(data);

		return {
			place: result,
		};
	}

	async _delete(data: Places.dto.DeleteInput): Promise<void> {
		await this.repository._delete(data);
	}
}
