import { $dto, $extended, Pagination } from '@wanderlust/common';
import z from 'zod';

const place = $extended.place;

export const getInput = place.pick({
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

export const listInput = z.object({});

export const listOutput = z.object({
	places: place.array(),
});

export type ListOutput = z.infer<typeof listOutput>;

export const updateInput = $dto.place.omit({
	createdAt: true,
	updatedAt: true,
	rating: true,
});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({
	place: place,
});

export type UpdateOutput = z.infer<typeof updateOutput>;

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
