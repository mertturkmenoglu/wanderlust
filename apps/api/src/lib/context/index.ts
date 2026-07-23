import type { AuthService } from '@wanderlust/auth';
import { Tokens } from '@wanderlust/common';
import type { Context as HonoContext } from 'hono';
import type { Container } from 'inversify';
import type { SetNonNullable } from '../type-utils';

export type AppContext = HonoContext;

export type CreateContextOptions = {
	context: AppContext;
	container: Container;
};

export async function createContext({
	context,
	container,
}: CreateContextOptions) {
	const auth = container.get<AuthService>(Tokens.Auth);

	const session = await auth.api.getSession({
		headers: context.req.raw.headers,
	});

	return {
		session,
		container,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export type AuthContext = SetNonNullable<Context, 'session'>;
