import { z } from 'zod';

export const schema = z
  .object({
    locations: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
        categoryName: z.string(),
        city: z.string(),
        state: z.string(),
        description: z.string().max(256).nullable(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const ids = new Set(data.locations.map((l) => l.id));
    if (ids.size !== data.locations.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Location IDs must be unique',
        path: ['locations'],
        fatal: true,
      });

      return z.NEVER;
    }
  });

export type FormInput = z.infer<typeof schema>;
