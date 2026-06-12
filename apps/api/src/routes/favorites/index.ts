import { implement } from '@orpc/server';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { contract } from './contract';
import { FavoritesRepository } from './repository';
import { FavoritesService } from './service';

export function getRouter() {
	const os = implement(contract).$context<AuthContext>().use(requireAuth);
	const svc = container.get(FavoritesService);

	return os.router({
		list: os.list.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.list(userId, input);

			return result;
		}),
		create: os.create.handler(async ({ input, context }) => {
			const { id: userId, username } = context.session.user;
			const result = await svc.create(userId, username, input);

			return result;
		}),
		delete: os.delete.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			await svc._delete(userId, input);

			return {};
		}),
		listByUsername: os.listByUsername.handler(async ({ input }) => {
			const result = await svc.listByUsername(input);

			return result;
		}),
	});
}

export const module = new ContainerModule(({ bind }) => {
	bind(FavoritesService).toSelf();
	bind(FavoritesRepository).toSelf();
});
