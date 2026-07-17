import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	export const createInput = Types.Bookmarks.$Insert.Bookmark;

	export type CreateInput = z.infer<typeof createInput>;

	export const createOutput = z.object({
		bookmark: Types.Bookmark,
	});

	export type CreateOutput = z.infer<typeof createOutput>;

	export const deleteInput = Types.Bookmark.pick({
		placeId: true,
	});

	export type DeleteInput = z.infer<typeof deleteInput>;

	export const deleteOutput = z.object({});

	export type DeleteOutput = z.infer<typeof deleteOutput>;

	export const listInput = Types.Pagination.queryParamsSchema.extend({});

	export type ListInput = z.infer<typeof listInput>;

	export const listOutput = z.object({
		bookmarks: z.array(Types.Bookmarks.Extended),
		pagination: Types.Pagination.schema,
	});

	export type ListOutput = z.infer<typeof listOutput>;
}
