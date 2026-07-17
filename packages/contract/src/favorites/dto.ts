import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	export const createInput = Types.Favorite.pick({
		placeId: true,
	});

	export type CreateInput = z.infer<typeof createInput>;

	export const createOutput = z.object({
		favorite: Types.Favorite,
	});

	export type CreateOutput = z.infer<typeof createOutput>;

	export const deleteInput = Types.Favorite.pick({
		placeId: true,
	});

	export type DeleteInput = z.infer<typeof deleteInput>;

	export const deleteOutput = z.object({});

	export type DeleteOutput = z.infer<typeof deleteOutput>;

	export const listInput = Types.Pagination.queryParamsSchema.extend({});

	export type ListInput = z.infer<typeof listInput>;

	export const listOutput = z.object({
		favorites: Types.Favorites.Extended.array(),
		pagination: Types.Pagination.schema,
	});

	export type ListOutput = z.infer<typeof listOutput>;

	export const listByUsernameInput = Types.Pagination.queryParamsSchema.extend({
		username: Types.User.pick({ username: true }).shape.username,
	});

	export type ListByUsernameInput = z.infer<typeof listByUsernameInput>;

	export const listByUsernameOutput = z.object({
		favorites: Types.Favorites.Extended.array(),
		pagination: Types.Pagination.schema,
	});

	export type ListByUsernameOutput = z.infer<typeof listByUsernameOutput>;
}
