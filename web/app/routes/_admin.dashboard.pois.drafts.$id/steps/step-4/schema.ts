import { z } from "zod";

export const schema = z.object({
  openHours: z.array(
    z.object({
      day: z.string(),
      opensAt: z.string(),
      closesAt: z.string(),
    })
  ),
});

export type FormInput = z.infer<typeof schema>;
