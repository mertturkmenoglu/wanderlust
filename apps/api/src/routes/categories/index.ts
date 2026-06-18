import { implement } from '@orpc/server';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { contract } from './contract';
import { CategoriesRepository } from './repository';
import { CategoriesService } from './service';

export function getRouter() {
	const os = implement(contract).$context<Context>();
	const svc = container.get(CategoriesService);

	return os.use(withErrorNormalization).router({
		list: os.list.handler(async () => {
			const result = await svc.list();
			return result;
		}),
		create: os.create
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await svc.create(input);

				return result;
			}),
		update: os.update
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await svc.update(input);

				return result;
			}),
		delete: os.delete
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				await svc._delete(input);

				return {};
			}),
	});
}

export const module = new ContainerModule(({ bind }) => {
	bind(CategoriesService).toSelf();
	bind(CategoriesRepository).toSelf();
});
