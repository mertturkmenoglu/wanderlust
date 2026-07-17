import type { Categories } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { CategoriesRepository } from './repository';

@injectable()
@TraceAll()
export class CategoriesService {
	constructor(
		@inject(CategoriesRepository)
		private readonly repository: CategoriesRepository,
	) {}

	async get(data: Categories.dto.GetInput): Promise<Categories.dto.GetOutput> {
		const result = await this.repository.get(data);

		return {
			category: result,
		};
	}

	async list(): Promise<Categories.dto.ListOutput> {
		const result = await this.repository.list();

		return {
			categories: result,
		};
	}

	async create(
		data: Categories.dto.CreateInput,
	): Promise<Categories.dto.CreateOutput> {
		const result = await this.repository.create(data);

		return {
			category: result,
		};
	}

	async update(
		data: Categories.dto.UpdateInput,
	): Promise<Categories.dto.UpdateOutput> {
		const result = await this.repository.update(data);

		return {
			category: result,
		};
	}

	async _delete(data: Categories.dto.DeleteInput): Promise<void> {
		await this.repository._delete(data);
	}
}
