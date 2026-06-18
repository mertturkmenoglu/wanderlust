import { implement } from '@orpc/server';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { contract } from './contract';
import { BookmarksRepository } from './repository';
import { BookmarksService } from './service';

export function getRouter() {
	const os = implement(contract).$context<AuthContext>().use(requireAuth);
	const svc = container.get(BookmarksService);

	return os
		.use(withErrorNormalization)
		.router({
			list: os.list.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.list(userId, input);

				return result;
			}),
			create: os.create.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.create(userId, input);

				return result;
			}),
			delete: os.delete.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				await svc._delete(userId, input);

				return {};
			}),
		});
}

export const module = new ContainerModule(({ bind }) => {
	bind(BookmarksService).toSelf();
	bind(BookmarksRepository).toSelf();
});
