import { implement } from '@orpc/server';
import { addresses } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { AddressesRepository } from './repository';
import { AddressesService } from './service';

export const module = defineModule({
	exports: [AddressesService, AddressesRepository],
	router: () => {
		const os = implement(addresses.contract)
			.$context<AuthContext>()
			.use(requireAuth)
			.use(isAdmin)
			.use(withErrorNormalization)
			.use(withTracing);

		const svc = container.get(AddressesService);

		return os.router({
			create: os.create.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.create(userId, input);

				return result;
			}),
			list: os.list.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.list(userId, input);

				return result;
			}),
			delete: os.delete.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				await svc._delete(userId, input);

				return {};
			}),
			get: os.get.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.get(userId, input);

				return result;
			}),
			update: os.update.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.update(userId, input);

				return result;
			}),
		});
	},
});
