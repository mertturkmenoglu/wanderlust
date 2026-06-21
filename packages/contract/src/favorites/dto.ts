import { $dto, $extended, Pagination } from '@wanderlust/common';
import z from 'zod';

export const createInput = $dto.favorite.pick({
	placeId: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
	favorite: $dto.favorite,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const deleteInput = $dto.favorite.pick({
	placeId: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const listInput = Pagination.queryParamsSchema.extend({});

export type ListInput = z.infer<typeof listInput>;


export const listOutput = z.object({
	favorites: $dto.favorite
		.extend({
			place: $extended.place,
		})
		.array(),
	pagination: Pagination.schema,
});

export type ListOutput = z.infer<typeof listOutput>;

export const listByUsernameInput = Pagination.queryParamsSchema.extend({
	username: $dto.user.pick({ username: true }).shape.username,
});

export type ListByUsernameInput = z.infer<typeof listByUsernameInput>;

export const listByUsernameOutput = z.object({
	favorites: $dto.favorite
		.extend({
			place: $extended.place,
		})
		.array(),
	pagination: Pagination.schema,
});

export type ListByUsernameOutput = z.infer<typeof listByUsernameOutput>;
