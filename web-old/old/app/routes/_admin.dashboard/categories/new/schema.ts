import { z } from "zod";

export const schema = z.object({
  id: z.number().min(1),
  name: z.string().min(1),
  image: z.string().min(1),
});

export type FormInput = z.infer<typeof schema>;
