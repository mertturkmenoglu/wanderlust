import { z } from "zod";

export const schema = z.object({
  title: z.string().min(1).max(128),
  description: z.string().min(1).max(4096).default("").catch(""),
  shareWithFriends: z.boolean().default(false),
  date: z.coerce.date().default(new Date()),
  locations: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
        categoryName: z.string(),
        city: z.string(),
        state: z.string(),
        description: z.string().max(256).default(""),
      })
    )
    .default([]),
  friends: z
    .array(
      z.object({
        id: z.string(),
        username: z.string(),
        fullName: z.string(),
        profileImage: z.string().nullable(),
      })
    )
    .default([]),
  friendSearch: z.string().default(""),
});

export type FormInput = z.infer<typeof schema>;
