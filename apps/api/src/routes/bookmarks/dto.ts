import { $dto, $extended, Pagination } from '@wanderlust/common';
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

export const listOutput = z.object({
	bookmarks: $dto.bookmark
		.extend({
			place: $extended.place,
			meta: z.object({
				isFavorite: z.boolean(),
			}),
		})
		.array(),
	pagination: Pagination.schema,
});

export type ListOutput = z.infer<typeof listOutput>;
