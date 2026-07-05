import { trace } from '@opentelemetry/api';
import { CacheService, type TCacheService } from '@wanderlust/cache';
import type { preferences as dto } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { PreferencesRepository } from './repository';

@injectable()
@TraceAll()
export class PreferencesService {
	private readonly ns = 'preferences';
	private readonly cache: TCacheService;

	constructor(
		@inject(PreferencesRepository)
		private readonly repo: PreferencesRepository,
		@inject(CacheService) cache: CacheService,
	) {
		this.cache = cache.get();
	}

	async get(userId: string, data: dto.GetInput): Promise<dto.GetOutput> {
		const span = trace.getActiveSpan();

		const result = await this.cache.namespace(this.ns).getOrSet({
			key: userId,
			ttl: '1h',

			factory: async () => {
				span?.addEvent('cache-miss', {
					'user.id': userId,
				});

				return this.repo.get(userId, data);
			},
			grace: '1m',
		});

		return result;
	}

	async update(
		userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		const result = await this.repo.update(userId, data);

		await this.cache.namespace(this.ns).set({
			key: userId,
			value: result,
			ttl: '1h',
		});

		return result;
	}
}
