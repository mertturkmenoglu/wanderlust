import { $dto, Pagination } from '@wanderlust/common';
import z from 'zod';

const place = $dto.place.extend({
	assets: $dto.asset.array(),
	category: $dto.category,
	address: $dto.address.extend({
		city: $dto.city,
	}),
});

export const getInput = $dto.place.pick({
	id: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	place: place,
	meta: z.object({
		isFavorite: z.boolean().meta({
			description: 'Whether the place is marked as favorite by the user',
			examples: [true],
		}),
		isBookmarked: z.boolean().meta({
			description: "Whether the place is bookmarked in any of the user's lists",
			examples: [false],
		}),
	}),
});

export type GetOutput = z.infer<typeof getOutput>;

export const peekInput = z.object({});

export const peekOutput = z.object({
	places: place.array(),
});

export type PeekOutput = z.infer<typeof peekOutput>;

export const updateInput = $dto.place.pick({
	id: true,
	name: true,
	categoryId: true,
	description: true,
	phone: true,
	website: true,
	accessibilityLevel: true,
	priceLevel: true,
});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({
	place: place,
});

export type UpdateOutput = z.infer<typeof updateOutput>;

export const updateAddressInput = $dto.place.pick({ id: true }).extend(
	z.object({
		address: $dto.address.pick({
			id: true,
			cityId: true,
			line1: true,
			line2: true,
			postalCode: true,
			lat: true,
			lng: true,
		}),
	}).shape,
);

export type UpdateAddressInput = z.infer<typeof updateAddressInput>;

export const updateAddressOutput = z.object({
	place: place,
});

export type UpdateAddressOutput = z.infer<typeof updateAddressOutput>;

export const updateAmenitiesInput = $dto.place.pick({
	id: true,
	amenities: true,
});

export type UpdateAmenitiesInput = z.infer<typeof updateAmenitiesInput>;

export const updateAmenitiesOutput = z.object({
	place: place,
});

export type UpdateAmenitiesOutput = z.infer<typeof updateAmenitiesOutput>;

export const updateHoursInput = $dto.place.pick({
	id: true,
	hours: true,
});

export type UpdateHoursInput = z.infer<typeof updateHoursInput>;

export const updateHoursOutput = z.object({
	place: place,
});

export type UpdateHoursOutput = z.infer<typeof updateHoursOutput>;

export const deleteInput = $dto.place.pick({
	id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export const searchAddressesInput = z.object({
	query: z.string().min(1).max(128),
});

export type SearchAddressesInput = z.infer<typeof searchAddressesInput>;

export const searchAddressesOutput = z.object({
	addresses: z.array($dto.address),
	pagination: Pagination.schema,
});

export type SearchAddressesOutput = z.infer<typeof searchAddressesOutput>;
