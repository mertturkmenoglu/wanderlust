import { implement } from '@orpc/server';
import { reports } from '@wanderlust/contract';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { ReportsRepository } from './repository';
import { ReportsService } from './service';

export function getRouter() {
	const os = implement(reports.contract)
		.$context<AuthContext>()
		.use(requireAuth);
	const svc = container.get(ReportsService);

	return os.use(withErrorNormalization).router({
		get: os.get.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.get(userId, input);

			return result;
		}),
		list: os.list.use(isAdmin).handler(async ({ input }) => {
			const result = await svc.list(input);

			return result;
		}),
		search: os.search.use(isAdmin).handler(async ({ input }) => {
			const result = await svc.search(input);

			return result;
		}),
		create: os.create.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.create(userId, input);

			return result;
		}),
		update: os.update.use(isAdmin).handler(async ({ input }) => {
			const result = await svc.update(input);

			return result;
		}),
		delete: os.delete.use(isAdmin).handler(async ({ input }) => {
			await svc._delete(input);

			return {};
		}),
	});
}

export const module = new ContainerModule(({ bind }) => {
	bind(ReportsService).toSelf();
	bind(ReportsRepository).toSelf();
});
