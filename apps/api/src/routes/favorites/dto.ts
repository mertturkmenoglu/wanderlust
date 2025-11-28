import z from 'zod';
import { $ } from '@/db/schema';
import { Pagination } from '@/lib/pagination';

export const createInput = $.favorite.pick({
	placeId: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
	favorite: $.favorite,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const deleteInput = $.favorite.pick({
	placeId: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const listInput = Pagination.queryParamsSchema.extend({});

export type ListInput = z.infer<typeof listInput>;

const place = $.place.extend({
	assets: $.asset.array(),
	category: $.category,
	address: $.address,
});

export const listOutput = z.object({
	favorites: $.favorite
		.extend({
			place: place,
		})
		.array(),
	pagination: Pagination.schema,
});

export type ListOutput = z.infer<typeof listOutput>;

export const listByUsernameInput = Pagination.queryParamsSchema.extend({
	username: $.user.pick({ username: true }).shape.username,
});

export type ListByUsernameInput = z.infer<typeof listByUsernameInput>;

export const listByUsernameOutput = z.object({
	favorites: $.favorite
		.extend({
			place: place,
		})
		.array(),
	pagination: Pagination.schema,
});

export type ListByUsernameOutput = z.infer<typeof listByUsernameOutput>;
