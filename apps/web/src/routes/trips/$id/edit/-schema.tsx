import { isBefore } from 'date-fns';
import { z } from 'zod';

const visibility = ['public', 'friends', 'private'] as const;

export type Visibility = (typeof visibility)[number];

const visibilityOptions: {
  label: string;
  value: Visibility;
  info: string;
}[] = [
  {
    label: 'Public',
    value: 'public',
    info: 'Anyone can see your trip.',
  },
  {
    label: 'Friends',
    value: 'friends',
    info: 'Only your friends can see your trip.',
  },
  {
    label: 'Private',
    value: 'private',
    info: 'Only you can see your trip. Any participants and comments will be removed.',
  },
];

const schema = z
  .object({
    title: z.string().min(1).max(128),
    description: z.string().min(0).max(1024),
    startAt: z.string(),
    endAt: z.string(),
    visibility: z.enum(visibility),
  })
  .superRefine((data, ctx) => {
    if (!isBefore(data.startAt, data.endAt)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'Start date must be before end date',
        path: ['startAt'],
        fatal: true,
      });

      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'Start date must be before end date',
        path: ['endAt'],
        fatal: true,
      });

      return z.NEVER;
    }

    if (isBefore(data.startAt, new Date())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date must be in the future',
        path: ['startAt'],
        fatal: true,
      });

      return z.NEVER;
    }
  });

function asVisibility(v: string): Visibility {
  if (v === 'public' || v === 'friends' || v === 'private') {
    return v;
  }

  throw new Error('Invalid visibility');
}

export { asVisibility, schema, visibilityOptions };
