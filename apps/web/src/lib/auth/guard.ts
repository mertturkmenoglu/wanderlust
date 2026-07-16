import { redirect } from '@tanstack/react-router';
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { authClient } from './client';

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
