import type { events as dto } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { EventsRepository } from './repository';

@injectable()
export class EventsService {
	constructor(
		@inject(EventsRepository) private readonly repo: EventsRepository,
	) { }

	async create(
		userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		const result = await this.repo.create(userId, data);

		return {
			event: result,
		};
	}

	async get(userId: string, data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.repo.get(userId, data);

		return {
			event: result,
		};
	}

	async list(userId: string, data: dto.ListInput): Promise<dto.ListOutput> {
		const result = await this.repo.list(userId, data);

		return {
			events: result.events,
			pagination: result.pagination,
		};
	}

	async update(
		userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		const result = await this.repo.update(userId, data);

		return {
			event: result,
		};
	}

	async delete(
		userId: string,
		data: dto.DeleteInput,
	): Promise<dto.DeleteOutput> {
		await this.repo.delete(userId, data);

		return {};
	}

	async updateAmenities(
		userId: string,
		data: dto.UpdateAmenitiesInput,
	): Promise<dto.UpdateAmenitiesOutput> {
		const result = await this.repo.updateAmenities(userId, data);

		return {
			event: result,
		};
	}

	async updateFaq(
		userId: string,
		data: dto.UpdateFaqInput,
	): Promise<dto.UpdateFaqOutput> {
		const result = await this.repo.updateFaq(userId, data);

		return {
			event: result,
		};
	}

	async updateCategories(
		userId: string,
		data: dto.UpdateCategoriesInput,
	): Promise<dto.UpdateCategoriesOutput> {
		const result = await this.repo.updateCategories(userId, data);

		return {
			event: result,
		};
	}

	async updateTicketOptions(
		userId: string,
		data: dto.UpdateTicketOptionsInput,
	): Promise<dto.UpdateTicketOptionsOutput> {
		const result = await this.repo.updateTicketOptions(userId, data);

		return {
			ticketOptions: result,
		};
	}

	async updateAgenda(
		userId: string,
		data: dto.UpdateAgendaInput,
	): Promise<dto.UpdateAgendaOutput> {
		const result = await this.repo.updateAgenda(userId, data);

		return {
			agenda: result,
		};
	}

	async updateLineup(
		userId: string,
		data: dto.UpdateLineupInput,
	): Promise<dto.UpdateLineupOutput> {
		const result = await this.repo.updateLineup(userId, data);

		return {
			lineup: result,
		};
	}

	async createAsset(
		userId: string,
		data: dto.CreateAssetInput,
	): Promise<dto.CreateAssetOutput> {
		const result = await this.repo.createAsset(userId, data);

		return {
			asset: result,
		};
	}

	async updateAssets(
		userId: string,
		data: dto.UpdateAssetsInput,
	): Promise<dto.UpdateAssetsOutput> {
		const result = await this.repo.updateAssets(userId, data);

		return {
			assets: result,
		};
	}

	async deleteAsset(
		userId: string,
		data: dto.DeleteAssetInput,
	): Promise<dto.DeleteAssetOutput> {
		await this.repo.deleteAsset(userId, data);
		return {};
	}

	async addToInterestedEvents(
		userId: string,
		data: dto.AddToInterestedEventsInput,
	): Promise<dto.AddToInterestedEventsOutput> {
		await this.repo.addToInterestedEvents(userId, data);
		return {};
	}

	async listMyInterestedEvents(
		userId: string,
		data: dto.ListMyInterestedEventsInput,
	): Promise<dto.ListMyInterestedEventsOutput> {
		const result = await this.repo.listMyInterestedEvents(userId, data);

		return {
			events: result.events,
			pagination: result.pagination,
		};
	}

	async deleteFromMyInterestedEvents(
		userId: string,
		data: dto.DeleteFromMyInterestedEventsInput,
	): Promise<dto.DeleteFromMyInterestedEventsOutput> {
		await this.repo.deleteFromMyInterestedEvents(userId, data);
		return {};
	}

	async listByPlaceId(
		userId: string,
		data: dto.ListByPlaceIdInput,
	): Promise<dto.ListByPlaceIdOutput> {
		const result = await this.repo.listByPlaceId(userId, data);

		return {
			events: result.events,
			pagination: result.pagination,
		};
	}

	async listByOrganizerId(
		userId: string,
		data: dto.ListByOrganizerIdInput,
	): Promise<dto.ListByOrganizerIdOutput> {
		const result = await this.repo.listByOrganizerId(userId, data);

		return {
			events: result.events,
			pagination: result.pagination,
		};
	}

	async listInterestedFriends(
		userId: string,
		data: dto.ListInterestedFriendsInput,
	): Promise<dto.ListInterestedFriendsOutput> {
		const result = await this.repo.listInterestedFriends(userId, data);

		return {
			users: result.users,
			pagination: result.pagination,
		};
	}
}
