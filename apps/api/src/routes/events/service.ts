import type * as dto from './dto';
import type { EventsRepository } from './repository';

export class EventsService {
	constructor(private readonly repo: EventsRepository) {}

	async create(
		userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {}

	async get(userId: string, data: dto.GetInput): Promise<dto.GetOutput> {}

	async list(userId: string, data: dto.ListInput): Promise<dto.ListOutput> {}

	async update(
		userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {}

	async delete(
		userId: string,
		data: dto.DeleteInput,
	): Promise<dto.DeleteOutput> {}

	async updateAmenities(
		userId: string,
		data: dto.UpdateAmenitiesInput,
	): Promise<dto.UpdateAmenitiesOutput> {}

	async updateFaq(
		userId: string,
		data: dto.UpdateFaqInput,
	): Promise<dto.UpdateFaqOutput> {}

	async updateCategories(
		userId: string,
		data: dto.UpdateCategoriesInput,
	): Promise<dto.UpdateCategoriesOutput> {}

	async updateTicketOptions(
		userId: string,
		data: dto.UpdateTicketOptionsInput,
	): Promise<dto.UpdateTicketOptionsOutput> {}

	async updateAgenda(
		userId: string,
		data: dto.UpdateAgendaInput,
	): Promise<dto.UpdateAgendaOutput> {}

	async updateLineup(
		userId: string,
		data: dto.UpdateLineupInput,
	): Promise<dto.UpdateLineupOutput> {}

	async createAsset(
		userId: string,
		data: dto.CreateAssetInput,
	): Promise<dto.CreateAssetOutput> {}

	async updateAssets(
		userId: string,
		data: dto.UpdateAssetsInput,
	): Promise<dto.UpdateAssetsOutput> {}

	async deleteAsset(
		userId: string,
		data: dto.DeleteAssetInput,
	): Promise<dto.DeleteAssetOutput> {}

	async addToInterestedEvents(
		userId: string,
		data: dto.AddToInterestedEventsInput,
	): Promise<dto.AddToInterestedEventsOutput> {}

	async listMyInterestedEvents(
		userId: string,
		data: dto.ListMyInterestedEventsInput,
	): Promise<dto.ListMyInterestedEventsOutput> {}

	async deleteFromMyInterestedEvents(
		userId: string,
		data: dto.DeleteFromMyInterestedEventsInput,
	): Promise<dto.DeleteFromMyInterestedEventsOutput> {}

	async listByPlaceId(
		userId: string,
		data: dto.ListByPlaceIdInput,
	): Promise<dto.ListByPlaceIdOutput> {}

	async listByOrganizerId(
		userId: string,
		data: dto.ListByOrganizerIdInput,
	): Promise<dto.ListByOrganizerIdOutput> {}

	async listInterestedFriends(
		userId: string,
		data: dto.ListInterestedFriendsInput,
	): Promise<dto.ListInterestedFriendsOutput> {}
}
