import { inject, injectable } from 'inversify';
import type * as dto from './dto';
import { CategoriesRepository } from './repository';

@injectable()
export class CategoriesService {
	constructor(@inject(CategoriesRepository) private readonly repository: CategoriesRepository) { }

	async list(): Promise<dto.ListOutput> {
		const result = await this.repository.list();

		return {
			categories: result,
		};
	}

	async create(data: dto.CreateInput): Promise<dto.CreateOutput> {
		const result = await this.repository.create(data);

		return {
			category: result,
		};
	}

	async update(data: dto.UpdateInput): Promise<dto.UpdateOutput> {
		const result = await this.repository.update(data);

		return {
			category: result,
		};
	}

	async _delete(data: dto.DeleteInput): Promise<void> {
		await this.repository._delete(data);
	}
}
