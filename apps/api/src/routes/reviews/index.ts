import { implement } from '@orpc/server';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { contract } from './contract';
import { ReviewsRepository } from './repository';
import { ReviewsService } from './service';

export function getRouter() {
	const os = implement(contract).$context<Context>();
	const svc = container.get(ReviewsService);

	return os.router({
		get: os.get.handler(async ({ input }) => {
			const result = await svc.get(input);

			return result;
		}),
		create: os.create.use(requireAuth).handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.create(userId, input);

			return result;
		}),
		delete: os.delete.use(requireAuth).handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			await svc._delete(userId, input);

			return {};
		}),
		listByUsername: os.listByUsername.handler(async ({ input }) => {
			const result = await svc.listByUsername(input);

			return result;
		}),
		listByPlaceId: os.listByPlaceId.handler(async ({ input }) => {
			const result = await svc.listByPlaceId(input);

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
	});
}

export const module = new ContainerModule(({ bind }) => {
	bind(ReviewsService).toSelf();
	bind(ReviewsRepository).toSelf();
});
