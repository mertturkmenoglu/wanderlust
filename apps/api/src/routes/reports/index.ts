import { implement } from '@orpc/server';
import { reports } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { ReportsRepository } from './repository';
import { ReportsService } from './service';

export const module = defineModule({
	exports: [ReportsService, ReportsRepository],
	router: () => {
		const os = implement(reports.contract)
			.$context<AuthContext>()
			.use(requireAuth)
			.use(withErrorNormalization)
			.use(withTracing);

		const svc = container.get(ReportsService);

		return os.router({
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
	},
});
