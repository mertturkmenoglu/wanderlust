import { z } from "zod";

export const schema = z.object({
  openTimes: z.object({
    mon: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
      closed: z.boolean().optional(),
    }),
    tue: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
      closed: z.boolean().optional(),
    }),
    wed: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
      closed: z.boolean().optional(),
    }),
    thu: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
      closed: z.boolean().optional(),
    }),
    fri: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
      closed: z.boolean().optional(),
    }),
    sat: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
      closed: z.boolean().optional(),
    }),
    sun: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
      closed: z.boolean().optional(),
    }),
  }),
});

export type FormInput = z.infer<typeof schema>;
