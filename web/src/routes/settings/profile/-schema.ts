import { z } from 'zod';

export const schema = z.object({
  fullName: z.string().min(1).max(128),
  bio: z.string().max(255).nullable(),
  pronouns: z.string().max(32).nullable(),
  website: z.string().max(255).url().nullable(),
  phone: z.string().max(32).nullable(),
});

export type FormInput = z.infer<typeof schema>;
