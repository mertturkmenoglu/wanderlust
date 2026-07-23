import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Aggregator } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { AggregatorEnricher } from './enricher';
import { AggregatorRepository } from './repository';

@injectable()
@TraceAll()
export class AggregatorService {
	private readonly ns = 'aggregator';

	constructor(
		@inject(Tokens.Cache) private readonly cache: CacheService,
		@inject(AggregatorRepository) private readonly repo: AggregatorRepository,
		@inject(AggregatorEnricher) private readonly enricher: AggregatorEnricher,
	) {}

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
