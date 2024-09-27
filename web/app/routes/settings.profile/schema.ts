import { z } from "zod";

export const schema = z.object({
  fullName: z.string().min(1).max(128),
  gender: z.string().min(1).max(32).optional(),
  bio: z.string().min(1).max(160).optional(),
  pronouns: z.string().min(1).max(32).optional(),
  website: z.string().min(1).max(256).url().optional(),
  phone: z.string().min(1).max(32).optional(),
});

export type FormInput = z.infer<typeof schema>;
