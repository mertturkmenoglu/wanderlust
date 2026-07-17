import { implement } from '@orpc/server';
import { Accolades } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { AccoladesRepository } from './repository';
import { AccoladesService } from './service';

export const module = defineModule({
	exports: [AccoladesService, AccoladesRepository],
	router: () => {
		const os = implement(Accolades.Contract)
			.$context<Context>()
			.use(withErrorNormalization)
			.use(withTracing);

		const svc = container.get(AccoladesService);

		return os.router({
			create: os.create
				.use(requireAuth)
				.use(isAdmin)
				.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.create(userId, input);

					return result;
				}),
			list: os.list.handler(async ({ input }) => {
				const result = await svc.list(input);

				return result;
			}),
			delete: os.delete
				.use(requireAuth)
				.use(isAdmin)
				.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					await svc._delete(userId, input);

					return {};
				}),
			get: os.get.handler(async ({ input }) => {
				const result = await svc.get(input);

				return result;
			}),
			listPlaces: os.listPlaces.handler(async ({ input, context }) => {
				const userId = context.session?.user?.id ?? null;
				const result = await svc.listPlaces(userId, input);

				return result;
			}),
			update: os.update
				.use(requireAuth)
				.use(isAdmin)
				.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.update(userId, input);

					return result;
				}),
		});
	},
});
