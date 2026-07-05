import { implement } from '@orpc/server';
import { cities } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { CitiesRepository } from './repository';
import { CitiesService } from './service';

export const module = defineModule({
	exports: [CitiesService, CitiesRepository],
	router: () => {
		const os = implement(cities.contract)
			.$context<Context>()
			.use(withErrorNormalization)
			.use(withTracing);

		const svc = container.get(CitiesService);

		return os.router({
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
	},
});
