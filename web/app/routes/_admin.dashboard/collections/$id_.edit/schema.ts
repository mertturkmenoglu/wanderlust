import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1).max(128),
  description: z.string().min(1).max(1024),
});

export type FormInput = z.infer<typeof schema>;
