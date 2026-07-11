import type { TAuthService } from '@wanderlust/auth';
import { createAuthClient } from 'better-auth/client';
import {
	adminClient,
	inferAdditionalFields,
	multiSessionClient,
} from 'better-auth/client/plugins';
import { L } from './logger';
import { Persistence } from './persistence';

export namespace Auth {
	const l = L.scope('auth');

	// This is meant to be used in only dev environment.
	// All "well known" test users have this password.
	const defaultPassword = 'LoremIpsum!1';

	export const client = createAuthClient({
		baseURL: import.meta.env.VITE_API_URL,
		plugins: [
			inferAdditionalFields<TAuthService>(),
			adminClient(),
			multiSessionClient(),
		],
	});

	export type User = typeof client.$Infer.Session.user;

	// Store the auth tokens for agents in a Map for easy retrieval
	export const tokens = new Map<string, string>();
	export const users = new Map<string, User>();

	export function setAuthState(
		tokensMap: Map<string, string>,
		usersMap: Map<string, User>,
	) {
		tokens.clear();
		users.clear();

		for (const [username, token] of tokensMap) {
			tokens.set(username, token);
		}

		for (const [username, user] of usersMap) {
			users.set(username, user);
		}
	}

	export async function signIn(username: string) {
		// All well-known test users have the same email format
		const email = `${username}@test.com`;

		// All well-known test users have the same password
		const password = defaultPassword;

		const res = await client.signIn.email(
			{
				email,
				password,
			},
			{
				onSuccess: (r) => {
					const token = r.response.headers.get('set-auth-token');

					if (!token) {
						l.error(new Error(`No token returned for user ${username}`));
						return;
					}

					l.info('Successfully signed in user', username);
					tokens.set(username, token);
				},
			},
		);

		if (!res.data?.user) {
			l.error(new Error(`No user returned for username ${username}`));
			return;
		}

		users.set(username, res.data.user);

		await Persistence.save(tokens, users);
	}
}
