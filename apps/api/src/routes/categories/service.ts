import { CacheService, type TCacheService } from '@wanderlust/cache';
import type { Categories } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';
import { CategoriesRepository } from './repository';

@injectable()
@TraceAll()
export class CategoriesService {
	private readonly ns = 'categories';
	private readonly cache: TCacheService;

	constructor(
		@inject(CategoriesRepository)
		private readonly repository: CategoriesRepository,
		@inject(CacheService)
		cache: CacheService,
	) {
		this.cache = cache.get();
	}

	async get(data: Categories.dto.GetInput): Promise<Categories.dto.GetOutput> {
		const list = await this.readFromCache();
		const cached = list.find((c) => c.id === data.id);

		invariant(cached, 'NOT_FOUND', `Category with ID ${data.id} not found`);

		return {
			category: cached,
		};
	}

	async list(): Promise<Categories.dto.ListOutput> {
		const result = await this.readFromCache();

		return {
			categories: result,
		};
	}

	async create(
		data: Categories.dto.CreateInput,
	): Promise<Categories.dto.CreateOutput> {
		const result = await this.repository.create(data);

		await this.invalidateCache();

		return {
			category: result,
		};
	}

	async update(
		data: Categories.dto.UpdateInput,
	): Promise<Categories.dto.UpdateOutput> {
		const result = await this.repository.update(data);

		await this.invalidateCache();

		return {
			category: result,
		};
	}

	async delete(data: Categories.dto.DeleteInput): Promise<void> {
		await this.repository.delete(data);

		await this.invalidateCache();
	}

	private async readFromCache() {
		return this.cache.namespace(this.ns).getOrSetForever({
			key: 'list',
			factory: async () => await this.repository.list(),
			grace: '6h',
		});
	}

	private async invalidateCache() {
		await this.cache.namespace(this.ns).delete({
			key: 'list',
		});
	}
}
