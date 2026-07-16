import type { TAuthService } from '@wanderlust/auth';
import {
	adminClient,
	inferAdditionalFields,
	multiSessionClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { tanstackStartCookies } from 'better-auth/tanstack-start';

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
