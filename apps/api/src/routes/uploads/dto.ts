import { z } from 'zod';

export const getNewUploadUrlSchema = z.object({
  type: z.enum(['reviews']),
  count: z.coerce.number().int().min(1).max(4),
});

export type GetNewUploadUrlQuery = z.infer<typeof getNewUploadUrlSchema>;
