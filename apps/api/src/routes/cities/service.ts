import { CacheService, type TCacheService } from '@wanderlust/cache';
import type { Cities } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { CitiesRepository } from './repository';

@injectable()
@TraceAll()
export class CitiesService {
	private readonly cache: TCacheService;

	constructor(
		@inject(CitiesRepository) private readonly repository: CitiesRepository,
		@inject(CacheService) cache: CacheService,
	) {
		this.cache = cache.get();
	}

	async list(): Promise<Cities.dto.ListOutput> {
		const result = await this.repository.list();

		return {
			cities: result,
		};
	}

	async listFeatured(): Promise<Cities.dto.ListFeaturedOutput> {
		const result = await this.cache.namespace('cities').getOrSet({
			key: 'featured',
			ttl: '1h',
			factory: () => this.repository.listFeatured(),
		});

		return {
			cities: result,
		};
	}

	async get(data: Cities.dto.GetInput): Promise<Cities.dto.GetOutput> {
		const result = await this.repository.get(data);

		return {
			city: result,
		};
	}

	async create(data: Cities.dto.CreateInput): Promise<Cities.dto.CreateOutput> {
		const result = await this.repository.create(data);

		await this.cache.namespace('cities').delete({
			key: 'featured',
		});

		return {
			city: result,
		};
	}

	async update(data: Cities.dto.UpdateInput): Promise<Cities.dto.UpdateOutput> {
		const result = await this.repository.update(data);

		await this.cache.namespace('cities').delete({
			key: 'featured',
		});

		return {
			city: result,
		};
	}

	async delete(data: Cities.dto.DeleteInput): Promise<void> {
		await this.repository.delete(data);

		await this.cache.namespace('cities').delete({
			key: 'featured',
		});
	}
}
