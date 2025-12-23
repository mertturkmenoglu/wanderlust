import { implement } from '@orpc/server';
import { DbProvider } from '@/db';
import { ioc } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { contract } from './contract';
import { ReportsRepository } from './repository';
import { ReportsService } from './service';

export function getRouter() {
	const os = implement(contract).$context<AuthContext>().use(requireAuth);
	const db = ioc.resolve(DbProvider.id);
	const repo = new ReportsRepository(db);
	const service = new ReportsService(repo);

	return os.router({
		get: os.get.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.get(userId, input);

			return result;
		}),
		list: os.list.use(isAdmin).handler(async ({ input }) => {
			const result = await service.list(input);

			return result;
		}),
		search: os.search.use(isAdmin).handler(async ({ input }) => {
			const result = await service.search(input);

			return result;
		}),
		create: os.create.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.create(userId, input);

			return result;
		}),
		update: os.update.use(isAdmin).handler(async ({ input }) => {
			const result = await service.update(input);

			return result;
		}),
		delete: os.delete.use(isAdmin).handler(async ({ input }) => {
			await service._delete(input);

			return {};
		}),
	});
}
