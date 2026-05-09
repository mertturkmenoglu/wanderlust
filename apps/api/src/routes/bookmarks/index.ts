import { implement } from '@orpc/server';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { contract } from './contract';
import { BookmarksService } from './service';

export function getRouter() {
	const os = implement(contract).$context<AuthContext>().use(requireAuth);
	const svc = container.get(BookmarksService);

	return os.router({
		list: os.list.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.list(userId, input);

			return result;
		}),
		create: os.create.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.create(userId, input);

			return result;
		}),
		delete: os.delete.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			await svc._delete(userId, input);

			return {};
		}),
	});
}
