import type { lists as dto } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { ListsRepository } from './repository';

@injectable()
export class ListsService {
	constructor(
		@inject(ListsRepository) private readonly repo: ListsRepository,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
	) { }

	async listAll(
		userId: string,
		data: dto.ListAllInput,
	): Promise<dto.ListAllOutput> {
		const result = await this.repo.listAll(userId, data);

		return {
			lists: result.lists,
			pagination: result.pagination,
		};
	}

	async listPublic(data: dto.ListPublicInput): Promise<dto.ListPublicOutput> {
		const result = await this.repo.listPublic(data);

		return {
			lists: result.lists,
			pagination: result.pagination,
		};
	}

	async get(userId: string, data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.repo.get(userId, data);

		return {
			list: result.list,
		};
	}

	async checkStatus(
		userId: string,
		data: dto.CheckStatusInput,
	): Promise<dto.CheckStatusOutput> {
		const result = await this.repo.checkStatus(userId, data);

		return {
			statuses: result.statuses,
		};
	}

	async create(
		userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
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
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		const result = await this.repo.update(userId, data);

		return {
			list: result.list,
		};
	}

	async _delete(
		userId: string,
		data: dto.DeleteInput,
	): Promise<dto.DeleteOutput> {
		await this.repo._delete(userId, data);

		return {};
	}

	async appendItem(
		userId: string,
		data: dto.AppendItemInput,
	): Promise<dto.AppendItemOutput> {
		const result = await this.repo.appendItem(userId, data);

		return {
			item: result.item,
		};
	}

	async updateItems(
		userId: string,
		data: dto.UpdateItemsInput,
	): Promise<dto.UpdateItemsOutput> {
		const result = await this.repo.updateItems(userId, data);

		return {
			list: result.list,
		};
	}

	async removeItem(
		userId: string,
		data: dto.RemoveItemInput,
	): Promise<dto.RemoveItemOutput> {
		await this.repo.removeItem(userId, data);

		return {};
	}
}
