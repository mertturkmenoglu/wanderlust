import { implement } from '@orpc/server';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { contract } from './contract';
import { CategoriesService } from './service';

export function getRouter() {
	const os = implement(contract).$context<Context>();
	const svc = container.get(CategoriesService);

	return os.router({
		list: os.list.handler(async () => {
			const result = await svc.list();
			return result;
		}),
		create: os.create
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				const result = await svc.create(input);

				return result;
			}),
		update: os.update
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				const result = await svc.update(input);

				return result;
			}),
		delete: os.delete
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				await svc._delete(input);

				return {};
			}),
	});
}
