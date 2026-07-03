import { $dto, Pagination } from '@wanderlust/common';
import z from 'zod';

const extended = $dto.address.extend({
	city: $dto.city,
});

export const createInput = $dto.address.pick({
	cityId: true,
	lat: true,
	lng: true,
	line1: true,
	line2: true,
	postalCode: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
	address: extended,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const deleteInput = $dto.address.pick({
	id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const listInput = Pagination.queryParamsSchema.extend({
	query: z.string().optional(),
	sort: z
		.object({
			field: z.string(),
			order: z.enum(['asc', 'desc']),
		})
		.optional(),
});

export type ListInput = z.infer<typeof listInput>;

export const listOutput = z.object({
	addresses: extended.array(),
	pagination: Pagination.schema,
});

export type ListOutput = z.infer<typeof listOutput>;

export const getInput = $dto.address.pick({
	id: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	address: extended,
});

export type GetOutput = z.infer<typeof getOutput>;

export const updateInput = $dto.address.pick({
	id: true,
	cityId: true,
	lat: true,
	lng: true,
	line1: true,
	line2: true,
	postalCode: true,
});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({
	address: extended,
});

export type UpdateOutput = z.infer<typeof updateOutput>;
