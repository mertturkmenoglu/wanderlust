import { AuthService } from '@wanderlust/auth';
import type { EvlogVariables } from 'evlog/hono';
import type { Context as HonoContext } from 'hono';
import type { Container } from 'inversify';
import type { SetNonNullable } from '../type-utils';

export type AppContext = HonoContext<EvlogVariables>;

export type CreateContextOptions = {
	context: AppContext;
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

	const logger = context.get('log');

	return {
		session,
		container,
		logger,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export type AuthContext = SetNonNullable<Context, 'session'>;
