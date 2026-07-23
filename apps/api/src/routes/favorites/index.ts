import { implement } from '@orpc/server';
import { Favorites } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { FavoriteStatusProvider } from './provides/status';
import { FavoritesRepository } from './repository';
import { FavoritesService } from './service';

export const module = defineModule({
	exports: [FavoritesService, FavoritesRepository, FavoriteStatusProvider],
	router: () => {
		const os = implement(Favorites.Contract)
			.$context<AuthContext>()
			.use(requireAuth)
			.use(withErrorNormalization)
			.use(withTracing);

		const svc = container.get(FavoritesService);

		return os.router({
			list: os.list.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.list(userId, input);

				return result;
			}),
			create: os.create.handler(async ({ input, context }) => {
				const { id: userId, username } = context.session.user;
				const result = await svc.create(userId, username, input);

				return result;
			}),
			delete: os.delete.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				await svc._delete(userId, input);

				return {};
			}),
			listByUsername: os.listByUsername.handler(async ({ input }) => {
				const result = await svc.listByUsername(input);

				return result;
			}),
		});
	},
});
