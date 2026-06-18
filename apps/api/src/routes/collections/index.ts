import { implement } from '@orpc/server';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { contract } from './contract';
import { CollectionsRepository } from './repository';
import { CollectionsService } from './service';

export function getRouter() {
	const os = implement(contract).$context<Context>();
	const svc = container.get(CollectionsService);

	return os.router({
		list: os.list
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await svc.list(input);

				return result;
			}),
		get: os.get.handler(async ({ context, input }) => {
			const userId = context.session?.user.id || null;
			const result = await svc.get(userId, input);

			return result;
		}),
		create: os.create
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await svc.create(input);

				return result;
			}),
		delete: os.delete
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				await svc._delete(input);

				return {};
			}),
		update: os.update
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await svc.update(input);

				return result;
			}),
		appendItem: os.appendItem
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await svc.appendItem(input);

				return result;
			}),
		removeItem: os.removeItem
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await svc.removeItem(input);

				return result;
			}),
		reorderItems: os.reorderItems
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.reorderItems(userId, input);

				return result;
			}),
		createPlaceRelation: os.createPlaceRelation
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await svc.createPlaceRelation(input);

				return result;
			}),
		deletePlaceRelation: os.deletePlaceRelation
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await svc.deletePlaceRelation(input);

				return result;
			}),
		createCityRelation: os.createCityRelation
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await svc.createCityRelation(input);

				return result;
			}),
		deleteCityRelation: os.deleteCityRelation
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await svc.deleteCityRelation(input);

				return result;
			}),
		listByPlaceId: os.listByPlaceId.handler(async ({ input, context }) => {
			const userId = context.session?.user.id || null;
			const result = await svc.listByPlaceId(userId, input);

			return result;
		}),
		listByCityId: os.listByCityId.handler(async ({ input, context }) => {
			const userId = context.session?.user.id || null;
			const result = await svc.listByCityId(userId, input);

			return result;
		}),
		listAllPlaceCollections: os.listAllPlaceCollections
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await svc.listAllPlaceCollections(input);

				return result;
			}),
		listAllCityCollections: os.listAllCityCollections
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await svc.listAllCityCollections(input);

				return result;
			}),
	});
}

export const module = new ContainerModule(({ bind }) => {
	bind(CollectionsRepository).toSelf();
	bind(CollectionsService).toSelf();
});
