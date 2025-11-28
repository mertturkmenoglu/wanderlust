import { EventSchemas } from 'inngest';
import z from 'zod';

export const schemas = new EventSchemas().fromSchema({
	'emails/send-reset-password': z.object({
		email: z.email(),
		url: z.url(),
	}),
});
