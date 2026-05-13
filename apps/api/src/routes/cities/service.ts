import { CacheService, type TCacheService } from '@wanderlust/cache';
import { inject, injectable } from 'inversify';
import type * as dto from './dto';
import { CitiesRepository } from './repository';

@injectable()
export class CitiesService {
	private readonly cache: TCacheService;

	constructor(
		@inject(CitiesRepository) private readonly repository: CitiesRepository,
		@inject(CacheService) cache: CacheService,
	) {
		this.cache = cache.get();
	}

	async list(): Promise<dto.ListOutput> {
		const result = await this.repository.list();

		return {
			cities: result,
		};
	}

	async listFeatured(): Promise<dto.ListFeaturedOutput> {
		const result = await this.cache.getOrSet({
			key: 'cities:featured',
			ttl: '1h',
			factory: () => this.repository.listFeatured(),
		});

		return {
			cities: result,
		};
	}

	async get(data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.repository.get(data);

		return {
			city: result,
		};
	}

	async create(data: dto.CreateInput): Promise<dto.CreateOutput> {
		const result = await this.repository.create(data);

		return {
			city: result,
		};
	}

	async update(data: dto.UpdateInput): Promise<dto.UpdateOutput> {
		const result = await this.repository.update(data);

		return {
			city: result,
		};
	}

	async _delete(data: dto.DeleteInput): Promise<void> {
		await this.repository._delete(data);
	}
}
