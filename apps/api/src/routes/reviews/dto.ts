import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { reviews } from '../../db';

export const createReviewSchema = createInsertSchema(reviews)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    likeCount: true,
    userId: true,
  })
  .merge(
    z.object({
      rating: z.number().int().min(1).max(10),
    })
  );

export type CreateReviewDto = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = createInsertSchema(reviews)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    likeCount: true,
  })
  .merge(
    z.object({
      rating: z.number().int().min(1).max(10).optional(),
    })
  )
  .partial();
