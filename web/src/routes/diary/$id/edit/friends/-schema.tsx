import { z } from 'zod';

export const schema = z.object({
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
