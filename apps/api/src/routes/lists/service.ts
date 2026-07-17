import type { Lists } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { TraceAll } from '@/lib/tracer';
import { ListsRepository } from './repository';

@injectable()
@TraceAll()
export class ListsService {
	constructor(
		@inject(ListsRepository) private readonly repo: ListsRepository,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
	) {}

	async listAll(
		userId: string,
		data: Lists.dto.ListInput,
	): Promise<Lists.dto.ListOutput> {
		const result = await this.repo.listAll(userId, data);

		return {
			lists: result.lists,
			pagination: result.pagination,
		};
	}

	async listPublic(
		data: Lists.dto.ListPublicInput,
	): Promise<Lists.dto.ListPublicOutput> {
		const result = await this.repo.listPublic(data);

		return {
			lists: result.lists,
			pagination: result.pagination,
		};
	}

	async get(
		userId: string,
		data: Lists.dto.GetInput,
	): Promise<Lists.dto.GetOutput> {
		const result = await this.repo.get(userId, data);

		return {
			list: result.list,
		};
	}

	async checkStatus(
		userId: string,
		data: Lists.dto.ListPlaceSaveStatInput,
	): Promise<Lists.dto.ListPlaceSaveStatOutput> {
		const result = await this.repo.checkStatus(userId, data);

		return {
			statuses: result.statuses,
		};
	}

	async create(
		userId: string,
		data: Lists.dto.CreateInput,
	): Promise<Lists.dto.CreateOutput> {
		const result = await this.repo.create(userId, data);

		if (result.list.isPublic) {
			await this.activities.addActivity(
				result.list.user.username,
				'create_list',
				{
					list: {
						id: result.list.id,
						name: result.list.name,
					},
				},
			);
		}

		return {
			list: result.list,
		};
	}

	async update(
		userId: string,
		data: Lists.dto.UpdateInput,
	): Promise<Lists.dto.UpdateOutput> {
		const result = await this.repo.update(userId, data);

		return {
			list: result.list,
		};
	}

	async _delete(
		userId: string,
		data: Lists.dto.DeleteInput,
	): Promise<Lists.dto.DeleteOutput> {
		await this.repo._delete(userId, data);

		return {};
	}

	async updateItems(
		userId: string,
		data: Lists.dto.ItemsUpdateInput,
	): Promise<Lists.dto.ItemsUpdateOutput> {
		const result = await this.repo.updateItems(userId, data);

		return {
			list: result.list,
		};
	}
}
