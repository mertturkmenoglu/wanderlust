import { implement } from '@orpc/server';
import { DbProvider } from '@/db';
import { ioc } from '@/ioc';
import type { Context } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { contract } from './contract';
import { CategoriesRepository } from './repository';
import { CategoriesService } from './service';

export function getRouter() {
	const os = implement(contract).$context<Context>();
	const db = ioc.resolve(DbProvider.id);
	const repo = new CategoriesRepository(db);
	const service = new CategoriesService(repo);

	return os.router({
		list: os.list.handler(async () => {
			const result = await service.list();

			return result;
		}),
		create: os.create
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				const result = await service.create(input);

				return result;
			}),
		update: os.update
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				const result = await service.update(input);

				return result;
			}),
		delete: os.delete
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				await service._delete(input);

				return {};
			}),
	});
}
