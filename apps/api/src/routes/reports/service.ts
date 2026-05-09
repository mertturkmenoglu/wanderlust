import { inject, injectable } from 'inversify';
import type * as dto from './dto';
import { ReportsRepository } from './repository';

@injectable()
export class ReportsService {
	constructor(@inject(ReportsRepository) private readonly repo: ReportsRepository) { }

	async get(userId: string, data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.repo.get(userId, data);

		return {
			report: result,
		};
	}

	async list(data: dto.ListInput): Promise<dto.ListOutput> {
		const result = await this.repo.list(data);

		return {
			reports: result.reports,
			pagination: result.pagination,
		};
	}

	async search(data: dto.SearchInput): Promise<dto.SearchOutput> {
		const result = await this.repo.search(data);

		return {
			reports: result.reports,
			pagination: result.pagination,
		};
	}

	async create(
		userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		const result = await this.repo.create(userId, data);

		return {
			report: result,
		};
	}

	async update(data: dto.UpdateInput): Promise<dto.UpdateOutput> {
		const result = await this.repo.update(data);

		return {
			report: result,
		};
	}

	async _delete(data: dto.DeleteInput): Promise<void> {
		await this.repo._delete(data);
	}
}
