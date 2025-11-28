import { implement } from '@orpc/server';
import { DbProvider } from '@/db';
import { ioc } from '@/ioc';
import type { Context } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { contract } from './contract';
import { CollectionsRepository } from './repository';
import { CollectionsService } from './service';

export function getRouter() {
	const os = implement(contract).$context<Context>();
	const db = ioc.resolve(DbProvider.id);
	const repo = new CollectionsRepository(db);
	const service = new CollectionsService(repo);

	return os.router({
		list: os.list
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await service.list(input);

				return result;
			}),
		get: os.get.handler(async ({ input }) => {
			const result = await service.get(input);

			return result;
		}),
		create: os.create
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await service.create(input);

				return result;
			}),
		delete: os.delete
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				await service._delete(input);

				return {};
			}),
		update: os.update
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await service.update(input);

				return result;
			}),
		appendItem: os.appendItem
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await service.appendItem(input);

				return result;
			}),
		removeItem: os.removeItem
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await service.removeItem(input);

				return result;
			}),
		reorderItems: os.reorderItems
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await service.reorderItems(input);

				return result;
			}),
		createPlaceRelation: os.createPlaceRelation
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await service.createPlaceRelation(input);

				return result;
			}),
		deletePlaceRelation: os.deletePlaceRelation
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await service.deletePlaceRelation(input);

				return result;
			}),
		createCityRelation: os.createCityRelation
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await service.createCityRelation(input);

				return result;
			}),
		deleteCityRelation: os.deleteCityRelation
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await service.deleteCityRelation(input);

				return result;
			}),
		listByPlaceId: os.listByPlaceId.handler(async ({ input }) => {
			const result = await service.listByPlaceId(input);

			return result;
		}),
		listByCityId: os.listByCityId.handler(async ({ input }) => {
			const result = await service.listByCityId(input);

			return result;
		}),
		listAllPlaceCollections: os.listAllPlaceCollections
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await service.listAllPlaceCollections(input);

				return result;
			}),
		listAllCityCollections: os.listAllCityCollections
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await service.listAllCityCollections(input);

				return result;
			}),
	});
}
