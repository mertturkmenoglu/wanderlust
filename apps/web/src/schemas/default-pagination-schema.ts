import z from 'zod';

export const defaultPaginationSchema = z.object({
	page: z.number().min(1).max(100).default(1).catch(1),
	pageSize: z.number().min(1).max(100).multipleOf(10).default(10).catch(10),
});
