import { implement } from '@orpc/server';
import { bookmarks } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { BookmarksRepository } from './repository';
import { BookmarksService } from './service';

export function getRouter() {}

export const module = defineModule({
	exports: [BookmarksRepository, BookmarksService],
	router: () => {
		const os = implement(bookmarks.contract)
			.$context<AuthContext>()
			.use(requireAuth)
			.use(withErrorNormalization)
			.use(withTracing);

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
	},
});
