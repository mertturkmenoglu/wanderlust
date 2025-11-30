import { redirect } from '@tanstack/react-router';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import type { TAuthService } from '../../../api/src/lib/auth';

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
