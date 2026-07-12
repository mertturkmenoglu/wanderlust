import type { TAuthService } from '@wanderlust/auth';
import { createAuthClient } from 'better-auth/client';
import {
	adminClient,
	inferAdditionalFields,
	multiSessionClient,
} from 'better-auth/client/plugins';
import { L } from './logger';

export namespace Auth {
	const l = L.scope('auth');

	// This is meant to be used in only dev environment.
	// All "well known" test users have this password.
	const defaultPassword = 'LoremIpsum!1';

	const client = createAuthClient({
		baseURL: import.meta.env.VITE_API_URL,
		plugins: [
			inferAdditionalFields<TAuthService>(),
			adminClient(),
			multiSessionClient(),
		],
	});

	export type User = typeof client.$Infer.Session.user;

	export async function signIn(username: string) {
		const email = `${username}@test.com`;
		const password = defaultPassword;

		let token: string | null = null;

		try {
			const res = await client.signIn.email(
				{
					email,
					password,
				},
				{
					onSuccess: (r) => {
						const t = r.response.headers.get('set-auth-token');

						if (!t) {
							l.error(new Error(`No token returned for user ${username}`));
							return;
						}

						l.info('Successfully signed in user', username);
						token = t;
					},
				},
			);

			if (!res.data?.user) {
				l.error(new Error(`No user returned for username ${username}`));
				return null;
			}

			if (!token) {
				l.error(new Error(`No token returned for user ${username}`));
				return null;
			}

			return {
				user: res.data.user,
				token: token as string,
			};
		} catch (err) {
			l.error(new Error(`Failed to sign in user ${username}: ${err}`));
			return null;
		}
	}
}
