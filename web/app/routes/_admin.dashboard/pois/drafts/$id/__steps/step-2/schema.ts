import { z } from "zod";

export const schema = z.object({
  address: z.object({
    cityId: z.number().min(1),
    line1: z.string().min(1),
    line2: z.string().optional(),
    postalCode: z.string().optional(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});

export type FormInput = z.infer<typeof schema>;
