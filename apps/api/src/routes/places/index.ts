import { implement } from '@orpc/server';
import { places } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { PlacesRepository } from './repository';
import { PlacesService } from './service';

export const module = defineModule({
	exports: [PlacesService, PlacesRepository],
	router: () => {
		const os = implement(places.contract)
			.$context<Context>()
			.use(withErrorNormalization)
			.use(withTracing);

		const svc = container.get(PlacesService);

		return os.router({
			get: os.get.handler(async ({ input, context }) => {
				const userId = context.session?.user?.id || null;
				const result = await svc.get(input, userId);

				return result;
			}),
			list: os.list.handler(async () => {
				const result = await svc.list();

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
			searchAddresses: os.searchAddresses
				.use(requireAuth)
				.use(isAdmin)
				.handler(async ({ input }) => {
					const result = await svc.searchAddresses(input);

					return result;
				}),
		});
	},
});
