import { implement } from '@orpc/server';
import { collections } from '@wanderlust/contract';
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
		const os = implement(collections.contract)
			.$context<Context>()
			.use(withErrorNormalization)
			.use(withTracing);

		const svc = container.get(CollectionsService);

		return os.router({
			list: os.list
				.use(requireAuth)
				.use(isAdmin)
				.handler(async ({ context, input }) => {
					const userId = getUserIdOrThrow(context);
					const result = await svc.list(userId, input);

					return result;
				}),
			get: os.get.handler(async ({ context, input }) => {
				const userId = getUserId(context);
				const result = await svc.get(userId, input);

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
			delete: os.delete
				.use(requireAuth)
				.use(isAdmin)
				.handler(async ({ context, input }) => {
					const userId = getUserIdOrThrow(context);
					const result = await svc._delete(userId, input);

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
			items: os.items.router({
				append: os.items.append
					.use(requireAuth)
					.use(isAdmin)
					.handler(async ({ context, input }) => {
						const userId = getUserIdOrThrow(context);
						const result = await svc.appendItem(userId, input);

						return result;
					}),
				remove: os.items.remove
					.use(requireAuth)
					.use(isAdmin)
					.handler(async ({ context, input }) => {
						const userId = getUserIdOrThrow(context);
						const result = await svc.removeItem(userId, input);

						return result;
					}),
				reorder: os.items.reorder
					.use(requireAuth)
					.use(isAdmin)
					.handler(async ({ context, input }) => {
						const userId = getUserIdOrThrow(context);
						const result = await svc.reorderItems(userId, input);

						return result;
					}),
			}),
			relations: os.relations.router({
				places: {
					get: os.relations.places.get.handler(async ({ context, input }) => {
						const userId = getUserIdOrThrow(context);
						const result = await svc.getCollectionPlaceRelation(userId, input);

						return result;
					}),
					list: os.relations.places.list.handler(async ({ context, input }) => {
						const userId = getUserIdOrThrow(context);
						const result = await svc.listCollectionPlaceRelations(
							userId,
							input,
						);

						return result;
					}),
					create: os.relations.places.create
						.use(requireAuth)
						.use(isAdmin)
						.handler(async ({ context, input }) => {
							const userId = getUserIdOrThrow(context);
							const result = await svc.createPlaceRelation(userId, input);

							return result;
						}),
					delete: os.relations.places.delete
						.use(requireAuth)
						.use(isAdmin)
						.handler(async ({ context, input }) => {
							const userId = getUserIdOrThrow(context);
							await svc.deletePlaceRelation(userId, input);

							return {};
						}),
				},
				cities: {
					get: os.relations.cities.get.handler(async ({ context, input }) => {
						const userId = getUserIdOrThrow(context);
						const result = await svc.getCollectionCityRelation(userId, input);

						return result;
					}),
					list: os.relations.cities.list.handler(async ({ context, input }) => {
						const userId = getUserIdOrThrow(context);
						const result = await svc.listCollectionCityRelations(userId, input);

						return result;
					}),
					create: os.relations.cities.create
						.use(requireAuth)
						.use(isAdmin)
						.handler(async ({ context, input }) => {
							const userId = getUserIdOrThrow(context);
							const result = await svc.createCityRelation(userId, input);

							return result;
						}),
					delete: os.relations.cities.delete
						.use(requireAuth)
						.use(isAdmin)
						.handler(async ({ context, input }) => {
							const userId = getUserIdOrThrow(context);
							await svc.deleteCityRelation(userId, input);

							return {};
						}),
				},
			}),
			listBy: os.listBy.router({
				place: os.listBy.place.handler(async ({ context, input }) => {
					const userId = getUserIdOrThrow(context);
					const result = await svc.listByPlace(userId, input);

					return result;
				}),
				city: os.listBy.city.handler(async ({ context, input }) => {
					const userId = getUserIdOrThrow(context);
					const result = await svc.listByCity(userId, input);

					return result;
				}),
			}),
		});
	},
});
