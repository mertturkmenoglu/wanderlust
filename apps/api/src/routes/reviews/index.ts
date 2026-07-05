import { trace } from '@opentelemetry/api';
import { implement } from '@orpc/server';
import { reviews } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { ReviewsRepository } from './repository';
import { ReviewsService } from './service';

export const module = defineModule({
	exports: [ReviewsService, ReviewsRepository],
	router: () => {
		const os = implement(reviews.contract)
			.$context<Context>()
			.use(withErrorNormalization);

		const svc = container.get(ReviewsService);

		return os.router({
			get: os.get.handler(async ({ input, context }) => {
				const userId = context.session?.user?.id || null;
				const result = await svc.get(userId, input);

				return result;
			}),
			create: os.create.use(requireAuth).handler(async ({ input, context }) => {
				const span = trace.getActiveSpan();

				const { id: userId, username } = context.session.user;

				span?.setAttribute('user.id', userId);
				span?.setAttribute('user.username', username);

				const result = await svc.create(userId, username, input);

				return result;
			}),
			delete: os.delete.use(requireAuth).handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				await svc._delete(userId, input);

				return {};
			}),
			listByUsername: os.listByUsername.handler(async ({ input, context }) => {
				const userId = context.session?.user?.id || null;
				const result = await svc.listByUsername(userId, input);

				return result;
			}),
			listByPlaceId: os.listByPlaceId.handler(async ({ input, context }) => {
				const userId = context.session?.user?.id || null;
				const result = await svc.listByPlaceId(userId, input);

				return result;
			}),
			getRatings: os.getRatings.handler(async ({ input }) => {
				const result = await svc.getRatings(input);

				return result;
			}),
			listAssetsByPlaceId: os.listAssetsByPlaceId.handler(async ({ input }) => {
				const result = await svc.listAssetsByPlaceId(input);

				return result;
			}),
			like: os.like.use(requireAuth).handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.like(userId, input);

				return result;
			}),
			listLikes: os.listLikes
				.use(requireAuth)
				.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.listLikes(userId, input);

					return result;
				}),
		});
	},
});
