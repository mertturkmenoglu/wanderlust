import { z } from "zod";

export const schema = z.object({
  title: z.string().min(1).max(128).default(""),
  description: z.string().min(1).max(4096).default(""),
  shareWithFriends: z.boolean().default(false),
  locations: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
        categoryName: z.string(),
        city: z.string(),
        state: z.string(),
      })
    )
    .default([]),
  friendSearch: z.string().min(1).max(128).default(""),
});

export type FormInput = z.infer<typeof schema>;
