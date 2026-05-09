import { implement } from '@orpc/server';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { contract } from './contract';
import { ListsService } from './service';

export function getRouter() {
	const os = implement(contract).$context<AuthContext>().use(requireAuth);
	const svc = container.get(ListsService);

	return os.router({
		listAll: os.listAll.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.listAll(userId, input);
			return result;
		}),
		listPublic: os.listPublic.handler(async ({ input }) => {
			const result = await svc.listPublic(input);

			return result;
		}),
		get: os.get.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.get(userId, input);

			return result;
		}),
		checkStatus: os.checkStatus.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.checkStatus(userId, input);

			return result;
		}),
		create: os.create.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.create(userId, input);

			return result;
		}),
		update: os.update.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.update(userId, input);

			return result;
		}),
		delete: os.delete.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			await svc._delete(userId, input);

			return {};
		}),
		appendItem: os.appendItem.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.appendItem(userId, input);

			return result;
		}),
		updateItems: os.updateItems.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.updateItems(userId, input);

			return result;
		}),
		removeItem: os.removeItem.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.removeItem(userId, input);

			return result;
		}),
	});
}
