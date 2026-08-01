import type { AuthService } from '@wanderlust/auth';
import type { Context as HonoContext } from 'hono';
import type { SetNonNullable } from '../type-utils';

export type AppContext = HonoContext;

export type CreateContextOptions = {
	context: AppContext;
	auth: AuthService;
};

export async function createContext({ context, auth }: CreateContextOptions) {
	const session = await auth.api.getSession({
		headers: context.req.raw.headers,
	});

	return {
		session,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export type AuthContext = SetNonNullable<Context, 'session'>;
