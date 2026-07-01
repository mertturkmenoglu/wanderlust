import z from 'zod';

export const defaultSearchSchema = z.object({
	page: z.number().min(1).max(1_000_000).optional().catch(1),
	pageSize: z.number().min(20).max(100).optional().catch(20),
	search: z.string().optional(),
});
