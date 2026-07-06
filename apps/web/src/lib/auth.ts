import { redirect } from '@tanstack/react-router';
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import type { TAuthService } from '@wanderlust/auth';
import {
	adminClient,
	inferAdditionalFields,
	multiSessionClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import z from 'zod';

export const authClient = createAuthClient({
	baseURL: new URL(
		'/api/auth',
		import.meta.env.VITE_API_URL ?? '__vite_api_url_not_defined',
	).toString(),
	plugins: [
		inferAdditionalFields<TAuthService>(),
		adminClient(),
		multiSessionClient(),
		tanstackStartCookies(),
	],
});

const authErrSchema = z.object({
	error: z.object({
		code: z.string(),
	}),
	status: z.number(),
	message: z.string(),
});

type AuthError = z.infer<typeof authErrSchema>;

export function isAuthError(err: unknown): err is AuthError {
	return authErrSchema.safeParse(err).success;
}

export const authGuard = createIsomorphicFn()
	.client(async () => {
		const session = await authClient.getSession();

		if (!session.data) {
			throw redirect({
				to: '/sign-in',
			});
		}

		return { auth: session.data };
	})
	.server(async () => {
		const headers = getRequestHeaders();

		const session = await authClient.getSession({
			fetchOptions: {
				headers,
			},
		});

		if (!session.data) {
			throw redirect({
				to: '/sign-in',
			});
		}

		return { auth: session.data };
	});
