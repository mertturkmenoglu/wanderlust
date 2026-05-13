import { $dto } from '@wanderlust/common';
import z from 'zod';
import { Pagination } from '@/lib/pagination';

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

const place = $dto.place.extend({
	assets: $dto.asset.array(),
	category: $dto.category,
	address: $dto.address.extend({
		city: $dto.city,
	}),
});

export const listOutput = z.object({
	favorites: $dto.favorite
		.extend({
			place: place,
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
			place: place,
		})
		.array(),
	pagination: Pagination.schema,
});

export type ListByUsernameOutput = z.infer<typeof listByUsernameOutput>;
