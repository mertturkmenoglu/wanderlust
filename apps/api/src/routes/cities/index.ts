import { implement } from '@orpc/server';
import { cities } from '@wanderlust/contract';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { CitiesRepository } from './repository';
import { CitiesService } from './service';

export function getRouter() {
	const os = implement(cities.contract).$context<Context>();
	const svc = container.get(CitiesService);

	return os.use(withErrorNormalization).router({
		list: os.list.handler(async () => {
			const result = await svc.list();

			return result;
		}),
		listFeatured: os.listFeatured.handler(async () => {
			const result = await svc.listFeatured();

			return result;
		}),
		get: os.get.handler(async ({ input }) => {
			const result = await svc.get(input);

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
	bind(CitiesService).toSelf();
	bind(CitiesRepository).toSelf();
});
