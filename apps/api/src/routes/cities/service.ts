import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Cities } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { CitiesRepository } from './repository';

@injectable()
@TraceAll()
export class CitiesService {
	private readonly ns = 'cities';

	constructor(
		@inject(CitiesRepository) private readonly repo: CitiesRepository,
		@inject(Tokens.Cache) private readonly cache: CacheService,
	) {}

	async list(): Promise<Cities.dto.ListOutput> {
		const result = await this.readFromCache();

		return {
			cities: result,
		};
	}

	async listFeatured(): Promise<Cities.dto.ListFeaturedOutput> {
		const result = await this.readFeaturedFromCache();

		return {
			cities: result,
		};
	}

	async get(data: Cities.dto.GetInput): Promise<Cities.dto.GetOutput> {
		const result = await this.readFromCacheById(data.id);

		return {
			city: result,
		};
	}

	async create(data: Cities.dto.CreateInput): Promise<Cities.dto.CreateOutput> {
		const result = await this.repo.create(data);

		await this.invalidateCache();

		return {
			city: result,
		};
	}

	async update(data: Cities.dto.UpdateInput): Promise<Cities.dto.UpdateOutput> {
		const result = await this.repo.update(data);

		await this.invalidateCache();

		return {
			city: result,
		};
	}

	async delete(data: Cities.dto.DeleteInput): Promise<void> {
		await this.repo.delete(data);

		await this.invalidateCache();
	}

	private async invalidateCache() {
		await this.cache.namespace(this.ns).clear();
	}

	private async readFromCache() {
		const result = await this.cache.namespace(this.ns).getOrSetForever({
			key: 'list',
			factory: () => this.repo.list(),
			grace: '6h',
		});

		return result;
	}

	private async readFeaturedFromCache() {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: 'featured',
			ttl: '6h',
			factory: () => this.repo.listFeatured(),
			grace: '6h',
		});

		return result;
	}

	private async readFromCacheById(id: string) {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: `get-${id}`,
			ttl: '6h',
			factory: () => this.repo.get({ id }),
			grace: '6h',
		});

		return result;
	}
}
