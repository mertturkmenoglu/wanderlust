import { CacheService, type TCacheService } from '@wanderlust/cache';
import type { Cities } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { CitiesRepository } from './repository';

@injectable()
@TraceAll()
export class CitiesService {
	private readonly ns = 'cities';
	private readonly cache: TCacheService;

	constructor(
		@inject(CitiesRepository) private readonly repository: CitiesRepository,
		@inject(CacheService) cache: CacheService,
	) {
		this.cache = cache.get();
	}

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
		const result = await this.repository.create(data);

		await this.invalidateCache();

		return {
			city: result,
		};
	}

	async update(data: Cities.dto.UpdateInput): Promise<Cities.dto.UpdateOutput> {
		const result = await this.repository.update(data);

		await this.invalidateCache();

		return {
			city: result,
		};
	}

	async delete(data: Cities.dto.DeleteInput): Promise<void> {
		await this.repository.delete(data);

		await this.invalidateCache();
	}

	private async invalidateCache() {
		await this.cache.namespace(this.ns).clear();
	}

	private async readFromCache() {
		const result = await this.cache.namespace(this.ns).getOrSetForever({
			key: 'list',
			factory: () => this.repository.list(),
			grace: '6h',
		});

		return result;
	}

	private async readFeaturedFromCache() {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: 'featured',
			ttl: '6h',
			factory: () => this.repository.listFeatured(),
			grace: '6h',
		});

		return result;
	}

	private async readFromCacheById(id: string) {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: `get-${id}`,
			ttl: '6h',
			factory: () => this.repository.get({ id }),
			grace: '6h',
		});

		return result;
	}
}
