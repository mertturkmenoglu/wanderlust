import { z } from 'zod';

export const schema = z.object({
  targetId: z.string().min(1),
  targetType: z.enum(['event', 'location', 'list', 'user', 'review']),
  reason: z.string().min(1),
  comment: z.string().nullable(),
});

export type FormInput = z.infer<typeof schema>;
