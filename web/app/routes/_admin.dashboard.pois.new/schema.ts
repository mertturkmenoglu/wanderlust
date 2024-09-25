import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  phone: z.string().optional(),
  website: z.string().optional(),
  priceLevel: z.number().min(1).max(5),
  accessibilityLevel: z.number().min(1).max(5),
  categoryId: z.number(),
  address: z.object({
    cityId: z.number().min(1),
    line1: z.string().min(1),
    line2: z.string().optional(),
    postalCode: z.string().optional(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  amenities: z.array(z.number()).optional(),
});

export type FormInput = z.infer<typeof schema>;
