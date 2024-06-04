import { z } from 'zod';

export const getNewUploadUrlSchema = z.object({
  type: z.enum(['reviews', 'locations']),
  count: z.coerce.number().int().min(1).max(4),
  mime: z.enum([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ]),
});

export type GetNewUploadUrlQuery = z.infer<typeof getNewUploadUrlSchema>;
