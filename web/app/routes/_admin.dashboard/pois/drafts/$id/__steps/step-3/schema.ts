import { z } from "zod";

export const schema = z.object({
  amenities: z.array(z.number()).optional(),
});

export type FormInput = z.infer<typeof schema>;
