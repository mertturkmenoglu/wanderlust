import { $dto, Pagination } from '@wanderlust/common';
import z from 'zod';

export const createInput = $dto.bookmark.pick({
	placeId: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
	bookmark: $dto.bookmark,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const deleteInput = $dto.bookmark.pick({
	placeId: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const listInput = Pagination.queryParamsSchema.extend({});

export type ListInput = z.infer<typeof listInput>;

const place = $dto.place.extend({
	assets: $dto.asset.array(),
	category: $dto.category,
	address: $dto.address.extend({
		city: $dto.city,
	}),
});

export const listOutput = z.object({
	bookmarks: $dto.bookmark
		.extend({
			place: place,
			meta: z.object({
				isFavorite: z.boolean(),
			}),
		})
		.array(),
	pagination: Pagination.schema,
});

export type ListOutput = z.infer<typeof listOutput>;
