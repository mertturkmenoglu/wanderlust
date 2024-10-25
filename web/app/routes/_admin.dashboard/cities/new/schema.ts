import { z } from "zod";

export const schema = z.object({
  id: z.number().min(1),
  name: z.string().min(1).max(64),
  stateCode: z.string().min(1).max(16),
  stateName: z.string().min(1).max(64),
  countryCode: z.string().length(2),
  countryName: z.string().min(1).max(64),
  imageUrl: z.string().min(1).max(256),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string().min(1).max(1024),
  imageLicense: z.string().min(1).max(32).nullable(),
  imageLicenseLink: z.string().min(1).max(256).nullable(),
  imageAttribute: z.string().min(1).max(256).nullable(),
  imageAttributionLink: z.string().min(1).max(256).nullable(),
});

export type FormInput = z.infer<typeof schema>;
