import { inject, injectable } from 'inversify';
import { CacheService, type TCacheService } from '@/lib/cache';
import type * as dto from './dto';
import { AggregatorRepository } from './repository';

@injectable()
export class AggregatorService {
	private readonly ns = 'aggregator';
	private readonly cache: TCacheService;
	private readonly repo: AggregatorRepository;

	constructor(@inject(CacheService) cache: CacheService, @inject(AggregatorRepository) repo: AggregatorRepository) {
		this.cache = cache.get();
		this.repo = repo;
	}

	async home(): Promise<dto.HomeOutput> {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: 'home',
			ttl: '1h',
			factory: async () => this.repo.home(),
			grace: '1h',
		});

		return result;
	}
}
