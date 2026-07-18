import { implement } from '@orpc/server';
import { Bookmarks } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { BookmarksRepository } from './repository';
import { BookmarksService } from './service';

export function getRouter() {}

export const module = defineModule({
	exports: [BookmarksRepository, BookmarksService],
	router: () => {
		const os = implement(Bookmarks.Contract)
			.$context<AuthContext>()
			.use(requireAuth)
			.use(withErrorNormalization)
			.use(withTracing);

		const svc = container.get(BookmarksService);

		return os.router({
			list: os.list.handler(async ({ input, context }) => {
				const userId = getUserIdOrThrow(context);
				const result = await svc.list(userId, input);

				return result;
			}),
			create: os.create.handler(async ({ input, context }) => {
				const userId = getUserIdOrThrow(context);
				const result = await svc.create(userId, input);

				return result;
			}),
			delete: os.delete.handler(async ({ input, context }) => {
				const userId = getUserIdOrThrow(context);
				const result = await svc.delete(userId, input);

				return result;
			}),
		});
	},
});
