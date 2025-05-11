import { z } from 'zod';

export const schema = z.object({
  title: z.string().min(1).max(128),
  description: z.string().min(1).max(4096),
  shareWithFriends: z.boolean(),
  date: z.coerce.date(),
  locations: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      image: z.string(),
      categoryName: z.string(),
      city: z.string(),
      state: z.string(),
      description: z.string().max(256),
    }),
  ),
  friends: z.array(
    z.object({
      id: z.string(),
      username: z.string(),
      fullName: z.string(),
      profileImage: z.string().nullable(),
    }),
  ),
  friendSearch: z.string(),
});

export type FormInput = z.infer<typeof schema>;
