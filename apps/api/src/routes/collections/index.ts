import { implement } from '@orpc/server';
import { Collections } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { getUserId, getUserIdOrThrow } from '@/lib/get-user-id';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { CollectionsRepository } from './repository';
import { CollectionsService } from './service';

export const module = defineModule({
	exports: [CollectionsService, CollectionsRepository],
	router: () => {
		const os = implement(Collections.Contract)
			.$context<Context>()
			.use(withErrorNormalization)
			.use(withTracing);

		const svc = container.get(CollectionsService);

		return os.router({
			get: os.get.handler(async ({ context, input }) => {
				const userId = getUserId(context);
				const result = await svc.get(userId, input);

				return result;
			}),
			list: os.list
				.use(requireAuth)
				.use(isAdmin)
				.handler(async ({ context, input }) => {
					const userId = getUserIdOrThrow(context);
					const result = await svc.list(userId, input);

					return result;
				}),
			create: os.create
				.use(requireAuth)
				.use(isAdmin)
				.handler(async ({ context, input }) => {
					const userId = getUserIdOrThrow(context);
					const result = await svc.create(userId, input);

					return result;
				}),
			update: os.update
				.use(requireAuth)
				.use(isAdmin)
				.handler(async ({ context, input }) => {
					const userId = getUserIdOrThrow(context);
					const result = await svc.update(userId, input);

					return result;
				}),
			delete: os.delete
				.use(requireAuth)
				.use(isAdmin)
				.handler(async ({ context, input }) => {
					const userId = getUserIdOrThrow(context);
					const result = await svc.delete(userId, input);

					return result;
				}),
			items: os.items.router({
				update: os.items.update
					.use(requireAuth)
					.use(isAdmin)
					.handler(async ({ context, input }) => {
						const userId = getUserIdOrThrow(context);
						const result = await svc.updateItems(userId, input);

						return result;
					}),
			}),
			places: os.places.router({
				list: os.places.list.handler(async ({ context, input }) => {
					const userId = getUserId(context);
					const result = await svc.listCollectionsForPlace(userId, input);

					return result;
				}),
				update: os.places.update
					.use(requireAuth)
					.use(isAdmin)
					.handler(async ({ context, input }) => {
						const userId = getUserIdOrThrow(context);
						const result = await svc.updateCollectionsForPlace(userId, input);

						return result;
					}),
			}),
			cities: os.cities.router({
				list: os.cities.list.handler(async ({ context, input }) => {
					const userId = getUserId(context);
					const result = await svc.listCollectionsForCity(userId, input);

					return result;
				}),
				update: os.cities.update
					.use(requireAuth)
					.use(isAdmin)
					.handler(async ({ context, input }) => {
						const userId = getUserIdOrThrow(context);
						const result = await svc.updateCollectionsForCity(userId, input);

						return result;
					}),
			}),
			relations: os.relations.router({
				places: os.relations.places
					.use(requireAuth)
					.use(isAdmin)
					.handler(async ({ context, input }) => {
						const userId = getUserIdOrThrow(context);
						const result = await svc.listPlacesForCollection(userId, input);

						return result;
					}),
				cities: os.relations.cities
					.use(requireAuth)
					.use(isAdmin)
					.handler(async ({ context, input }) => {
						const userId = getUserIdOrThrow(context);
						const result = await svc.listCitiesForCollection(userId, input);

						return result;
					}),
			}),
		});
	},
});
