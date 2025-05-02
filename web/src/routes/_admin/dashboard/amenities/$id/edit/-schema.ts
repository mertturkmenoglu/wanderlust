import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1).max(64),
});

export type FormInput = z.infer<typeof schema>;
