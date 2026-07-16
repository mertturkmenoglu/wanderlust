import { z } from 'zod';

export const authErrSchema = z.object({
	error: z.object({
		code: z.string(),
	}),
	status: z.number(),
	message: z.string(),
});

export type AuthError = z.infer<typeof authErrSchema>;

export function isAuthError(err: unknown): err is AuthError {
	return authErrSchema.safeParse(err).success;
}
