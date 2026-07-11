import { isBefore } from 'date-fns';
import z from 'zod';
import { visibility } from './trip-visibility';

export const createTripSchema = z
	.object({
		title: z
			.string({ error: 'Required' })
			.min(1, { error: 'Too short' })
			.max(256, { error: 'Too long' }),
		description: z
			.string({ error: 'Required' })
			.min(1, { error: 'Too short' })
			.max(8192, { error: 'Too long' }),
		startAt: z.date({ error: 'Required' }),
		endAt: z.date({ error: 'Required' }),
		visibilityLevel: z.enum(visibility, {
			error: 'Choose an option',
		}),
	})
	.superRefine((data, ctx) => {
		if (!isBefore(data.startAt, data.endAt)) {
			ctx.issues.push({
				code: 'custom',
				message: 'Start date must be before end date',
				path: ['startAt'],
				input: data.startAt,
				continue: false,
			});

			ctx.issues.push({
				code: 'custom',
				message: 'Start date must be before end date',
				path: ['endAt'],
				input: data.endAt,
				continue: false,
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

export type CreateTripFormInput = z.infer<typeof createTripSchema>;

export const updateTripSchema = createTripSchema.extend({});

export type UpdateTripFormInput = z.infer<typeof updateTripSchema>;
