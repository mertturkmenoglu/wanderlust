import { $dto, Pagination } from '@wanderlust/common';
import z from 'zod';

export const getInput = $dto.report.pick({
	id: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	report: $dto.report,
});

export type GetOutput = z.infer<typeof getOutput>;

export const listInput = Pagination.queryParamsSchema.extend({});

export type ListInput = z.infer<typeof listInput>;

export const listOutput = z.object({
	reports: z.array($dto.report),
	pagination: Pagination.schema,
});

export type ListOutput = z.infer<typeof listOutput>;

export const searchInput = Pagination.queryParamsSchema.extend(
	$dto.report
		.pick({
			reporterId: true,
			resourceType: true,
			reason: true,
			resolved: true,
		})
		.partial().shape,
);

export type SearchInput = z.infer<typeof searchInput>;

export const searchOutput = z.object({
	reports: z.array($dto.report),
	pagination: Pagination.schema,
});

export type SearchOutput = z.infer<typeof searchOutput>;

export const createInput = $dto.report.pick({
	resourceId: true,
	resourceType: true,
	reason: true,
	description: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
	report: $dto.report,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const deleteInput = $dto.report.pick({
	id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const updateInput = $dto.report.pick({
	id: true,
	description: true,
	reason: true,
	resolved: true,
});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({
	report: $dto.report,
});

export type UpdateOutput = z.infer<typeof updateOutput>;
