import { isBefore } from 'date-fns';
import z from 'zod';
import { visibility } from './trip-visibility';

export const createTripSchema = z
	.object({
		title: z
			.string('Required')
			.min(1, 'Too short')
			.max(128, 'At max 128 characters'),
		description: z
			.string('Required')
			.min(1, 'Too short')
			.max(1024, 'At max 1024 characters'),
		startAt: z.date('Required'),
		endAt: z.date('Required'),
		visibilityLevel: z.enum(visibility, 'Choose an option'),
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

export const updateTripSchema = createTripSchema;

export type UpdateTripFormInput = z.infer<typeof updateTripSchema>;
