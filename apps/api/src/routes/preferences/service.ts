import { CacheService, type TCacheService } from '@wanderlust/cache';
import type { preferences as dto } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { PreferencesRepository } from './repository';

@injectable()
export class PreferencesService {
	private readonly ns = 'preferences';
	private readonly cache: TCacheService;
	// private readonly log = createLogger({ name: 'PreferencesService' });

	constructor(
		@inject(PreferencesRepository)
		private readonly repo: PreferencesRepository,
		@inject(CacheService) cache: CacheService,
	) {
		this.cache = cache.get();
	}

	async get(userId: string, data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: userId,
			ttl: '1h',
			factory: async () => this.repo.get(userId, data),
			grace: '1m',
		});

		return result;
	}

	async update(
		userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		const result = await this.repo.update(userId, data);

		const _isCacheUpdated = await this.cache.namespace(this.ns).set({
			key: userId,
			value: result,
			ttl: '1h',
		});

		// if (!isCacheUpdated) {
		// 	this.log.warn('Failed to update cache for user preferences', {
		// 		userId,
		// 	});

		// 	this.log.emit();
		// }

		return result;
	}
}
