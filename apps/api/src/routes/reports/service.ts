import type { Reports } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { ReportsRepository } from './repository';

@injectable()
@TraceAll()
export class ReportsService {
	constructor(
		@inject(ReportsRepository) private readonly repo: ReportsRepository,
	) {}

	async get(
		userId: string,
		data: Reports.dto.GetInput,
	): Promise<Reports.dto.GetOutput> {
		const result = await this.repo.get(userId, data);

		return {
			report: result,
		};
	}

	async list(data: Reports.dto.ListInput): Promise<Reports.dto.ListOutput> {
		const result = await this.repo.list(data);

		return {
			reports: result.reports,
			pagination: result.pagination,
		};
	}

	async search(
		data: Reports.dto.SearchInput,
	): Promise<Reports.dto.SearchOutput> {
		const result = await this.repo.search(data);

		return {
			reports: result.reports,
			pagination: result.pagination,
		};
	}

	async create(
		userId: string,
		data: Reports.dto.CreateInput,
	): Promise<Reports.dto.CreateOutput> {
		const result = await this.repo.create(userId, data);

		return {
			report: result,
		};
	}

	async update(
		data: Reports.dto.UpdateInput,
	): Promise<Reports.dto.UpdateOutput> {
		const result = await this.repo.update(data);

		return {
			report: result,
		};
	}

	async _delete(data: Reports.dto.DeleteInput): Promise<void> {
		await this.repo._delete(data);
	}
}
