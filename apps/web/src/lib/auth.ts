import { redirect } from '@tanstack/react-router';
import type { TAuthService } from '@wanderlust/auth';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import z from 'zod';

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_API_URL,
	plugins: [inferAdditionalFields<TAuthService>()],
});

export async function authGuard() {
	const session = await authClient.getSession();

	if (!session.data) {
		throw redirect({
			to: '/sign-in',
		});
	}

	return { auth: session.data };
}

const authErrSchema = z.object({
	error: z.object({
		code: z.string(),
	}),
	status: z.number(),
	message: z.string(),
})

type AuthError = z.infer<typeof authErrSchema>;

export function isAuthError(err: unknown): err is AuthError {
	return authErrSchema.safeParse(err).success;
}
