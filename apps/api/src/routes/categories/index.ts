import { implement } from '@orpc/server';
import { Categories } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { CategoriesRepository } from './repository';
import { CategoriesService } from './service';

export const module = defineModule({
	exports: [CategoriesService, CategoriesRepository],
	router: () => {
		const os = implement(Categories.Contract)
			.$context<Context>()
			.use(withErrorNormalization)
			.use(withTracing);

		const svc = container.get(CategoriesService);

		return os.router({
			get: os.get.handler(async ({ input }) => {
				const result = await svc.get(input);

				return result;
			}),
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
	},
});
