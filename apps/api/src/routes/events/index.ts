import { implement } from '@orpc/server';
import { DbProvider } from '@/db';
import { ioc } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { contract } from './contract';
import { EventsRepository } from './repository';
import { EventsService } from './service';

export function getRouter() {
	const os = implement(contract).$context<AuthContext>().use(requireAuth);
	const db = ioc.resolve(DbProvider.id);
	const repo = new EventsRepository(db);
	const service = new EventsService(repo);

	return os.router({
		create: os.get.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.create(userId, input);

			return result;
		}),
		get: os.get.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.get(userId, input);

			return result;
		}),
		list: os.list.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.list(userId, input);

			return result;
		}),
		update: os.update.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.update(userId, input);

			return result;
		}),
		delete: os.delete.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.delete(userId, input);

			return result;
		}),
		updateAmenities: os.updateAmenities.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.updateAmenities(userId, input);

			return result;
		}),
		updateFaq: os.updateFaq.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.updateFaq(userId, input);

			return result;
		}),
		updateCategories: os.updateCategories.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await service.updateCategories(userId, input);

				return result;
			},
		),
		updateTicketOptions: os.updateTicketOptions.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await service.updateTicketOptions(userId, input);

				return result;
			},
		),
		updateAgenda: os.updateAgenda.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.updateAgenda(userId, input);

			return result;
		}),
		updateLineup: os.updateLineup.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.updateLineup(userId, input);

			return result;
		}),
		createAsset: os.createAsset.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.createAsset(userId, input);

			return result;
		}),
		updateAssets: os.updateAssets.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.updateAssets(userId, input);

			return result;
		}),
		deleteAsset: os.deleteAsset.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.deleteAsset(userId, input);

			return result;
		}),
		addToInterestedEvents: os.addToInterestedEvents.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await service.addToInterestedEvents(userId, input);

				return result;
			},
		),
		listMyInterestedEvents: os.listMyInterestedEvents.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await service.listMyInterestedEvents(userId, input);

				return result;
			},
		),
		deleteFromMyInterestedEvents: os.deleteFromMyInterestedEvents.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await service.deleteFromMyInterestedEvents(
					userId,
					input,
				);

				return result;
			},
		),
		listByPlaceId: os.listByPlaceId.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.listByPlaceId(userId, input);

			return result;
		}),
		listByOrganizerId: os.listByOrganizerId.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await service.listByOrganizerId(userId, input);

				return result;
			},
		),
		listInterestedFriends: os.listInterestedFriends.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await service.listInterestedFriends(userId, input);

				return result;
			},
		),
	});
}
