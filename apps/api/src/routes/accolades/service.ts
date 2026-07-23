import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Accolades } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { AccoladesEnricher } from './enricher';
import { AccoladesRepository } from './repository';

@injectable()
@TraceAll()
export class AccoladesService {
	private readonly ns = 'accolades';

	constructor(
		@inject(AccoladesRepository)
		private readonly repo: AccoladesRepository,
		@inject(Tokens.Cache) private readonly cache: CacheService,
		@inject(AccoladesEnricher) private readonly enricher: AccoladesEnricher,
	) {}

	async create(
		userId: string,
		data: Accolades.dto.CreateInput,
	): Promise<Accolades.dto.CreateOutput> {
		const result = await this.repo.create(userId, data);

		return result;
	}

	async list(data: Accolades.dto.ListInput): Promise<Accolades.dto.ListOutput> {
		const result = await this.repo.list(data);

		return result;
	}

	async _delete(
		userId: string,
		data: Accolades.dto.DeleteInput,
	): Promise<Accolades.dto.DeleteOutput> {
		await this.repo.delete(userId, data);

		return {};
	}

	async get(data: Accolades.dto.GetInput): Promise<Accolades.dto.GetOutput> {
		const result = await this.repo.get(data);

		return result;
	}

	async listPlaces(
		userId: string | null,
		data: Accolades.dto.ListPlacesInput,
	): Promise<Accolades.dto.ListPlacesOutput> {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: `places:${data.page}:${data.pageSize}`,
			factory: async () => this.repo.listPlaces(userId, data),
			grace: '1h',
			ttl: '1h',
		});

		const enrichedPlaces = await this.enricher.enrichPlaces(
			userId,
			result.places,
		);

		return {
			places: enrichedPlaces,
			pagination: result.pagination,
		};
	}

	async update(
		userId: string,
		data: Accolades.dto.UpdateInput,
	): Promise<Accolades.dto.UpdateOutput> {
		const result = await this.repo.update(userId, data);

		return result;
	}
}
