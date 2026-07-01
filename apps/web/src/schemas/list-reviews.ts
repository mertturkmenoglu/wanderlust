import z from 'zod';

export const listReviewsSchema = z.object({
	page: z.number().min(1).max(100).optional(),
	minRating: z.number().min(0).max(5).optional(),
	maxRating: z.number().min(0).max(5).optional(),
	sortBy: z.enum(['created_at', 'rating']).optional(),
	sortOrd: z.enum(['asc', 'desc']).optional(),
});
