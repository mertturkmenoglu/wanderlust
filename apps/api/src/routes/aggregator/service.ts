import { CacheService, type TCacheService } from '@wanderlust/cache';
import type { Aggregator } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { AggregatorEnricher } from './enricher';
import { AggregatorRepository } from './repository';

@injectable()
@TraceAll()
export class AggregatorService {
	private readonly ns = 'aggregator';
	private readonly cache: TCacheService;
	private readonly repo: AggregatorRepository;

	constructor(
		@inject(CacheService) cache: CacheService,
		@inject(AggregatorRepository) repo: AggregatorRepository,
		@inject(AggregatorEnricher) private readonly enricher: AggregatorEnricher,
	) {
		this.cache = cache.get();
		this.repo = repo;
	}

	async home(userId: string | null): Promise<Aggregator.dto.HomeOutput> {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: 'home',
			ttl: '1h',
			factory: async () => this.repo.home(),
			grace: '1h',
		});

		return this.enricher.enrichPlaces(userId, result);
	}
}
