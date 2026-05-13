import { AuthService } from '@wanderlust/auth';
import type { Container } from 'inversify';

export type CreateContextOptions = {
	request: Request;
	container: Container;
};

export async function createContext({
	request,
	container,
}: CreateContextOptions) {
	const auth = container.get(AuthService).get();

	const session = await auth.api.getSession({
		headers: request.headers,
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
