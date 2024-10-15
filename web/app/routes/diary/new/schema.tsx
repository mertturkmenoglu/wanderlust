import { z } from "zod";

export const schema = z.object({
  title: z.string().min(1).max(128),
  description: z.string().min(1).max(4096),
  shareWithFriends: z.boolean().default(false),
});

export type FormInput = z.infer<typeof schema>;
