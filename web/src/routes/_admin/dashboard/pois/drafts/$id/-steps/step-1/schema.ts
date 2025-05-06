import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).max(512),
  phone: z.string().optional(),
  website: z.string().optional(),
  priceLevel: z.number().min(1).max(5),
  accessibilityLevel: z.number().min(1).max(5),
  categoryId: z.number(),
});

export type FormInput = z.infer<typeof schema>;
