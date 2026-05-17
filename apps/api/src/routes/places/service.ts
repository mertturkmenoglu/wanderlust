import { inject, injectable } from 'inversify';
import type * as dto from './dto';
import { PlacesRepository } from './repository';

@injectable()
export class PlacesService {
	constructor(
		@inject(PlacesRepository) private readonly repository: PlacesRepository,
	) {}

	async get(data: dto.GetInput, userId: string | null): Promise<dto.GetOutput> {
		const result = await this.repository.get(data);

		if (userId === null) {
			return {
				place: result,
				meta: {
					isBookmarked: false,
					isFavorite: false,
				},
			};
		}

		const isFavorite = await this.repository.isFavorite(data.id, userId);
		const isBookmarked = await this.repository.isBookmarked(data.id, userId);

		return {
			place: result,
			meta: {
				isFavorite,
				isBookmarked,
			},
		};
	}

	async peek(): Promise<dto.PeekOutput> {
		const result = await this.repository.peek();

		return {
			places: result,
		};
	}

	async update(data: dto.UpdateInput): Promise<dto.UpdateOutput> {
		const result = await this.repository.update(data);

		return {
			place: result,
		};
	}

	async updateAddress(
		data: dto.UpdateAddressInput,
	): Promise<dto.UpdateAddressOutput> {
		const result = await this.repository.updateAddress(data);

		return {
			place: result,
		};
	}

	async updateAmenities(
		data: dto.UpdateAmenitiesInput,
	): Promise<dto.UpdateAmenitiesOutput> {
		const result = await this.repository.updateAmenities(data);

		return {
			place: result,
		};
	}

	async updateHours(
		data: dto.UpdateHoursInput,
	): Promise<dto.UpdateHoursOutput> {
		const result = await this.repository.updateHours(data);

		return {
			place: result,
		};
	}

	async _delete(data: dto.DeleteInput): Promise<void> {
		await this.repository._delete(data);
	}

	async searchAddresses(
		data: dto.SearchAddressesInput,
	): Promise<dto.SearchAddressesOutput> {
		const result = await this.repository.searchAddresses(data);

		return {
			addresses: result.addresses,
			pagination: result.pagination,
		};
	}
}
