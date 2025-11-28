import { implement } from '@orpc/server';
import { DbProvider } from '@/db';
import { ioc } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { contract } from './contract';
import { BookmarksRepository } from './repository';
import { BookmarksService } from './service';

export function getRouter() {
	const os = implement(contract).$context<AuthContext>().use(requireAuth);
	const db = ioc.resolve(DbProvider.id);
	const repo = new BookmarksRepository(db);
	const service = new BookmarksService(repo);

	return os.router({
		list: os.list.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.list(userId, input);

			return result;
		}),
		create: os.create.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.create(userId, input);

			return result;
		}),
		delete: os.delete.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			await service._delete(userId, input);

			return {};
		}),
	});
}
