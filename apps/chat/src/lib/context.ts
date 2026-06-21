import { AuthService } from '@wanderlust/auth';
import type { Context as HonoContext } from 'hono';
import type { Container } from 'inversify';

export type CreateContextOptions = {
	context: HonoContext;
	container: Container;
};

export async function createContext({
	context,
	container,
}: CreateContextOptions) {
	const auth = container.get(AuthService).get();

	const session = await auth.api.getSession({
		headers: context.req.raw.headers,
	});

	return {
		session,
		container,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export type AuthContext = {
	session: NonNullable<Context['session']>;
	container: Container;
};
