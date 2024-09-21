import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  country: z.string().length(2),
  city: z.string().min(1),
  state: z.string().optional(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  postalCode: z.string().optional(),
  lat: z.number().min(-90).max(90),
  long: z.number().min(-180).max(180),
  phone: z.string().optional(),
  website: z.string().optional(),
  priceLevel: z.number().min(1).max(5),
  accessibilityLevel: z.number().min(1).max(5),
  hasWifi: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.number(),
});

export type FormInput = z.infer<typeof schema>;
