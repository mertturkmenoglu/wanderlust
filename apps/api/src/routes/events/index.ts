import { implement } from '@orpc/server';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { contract } from './contract';
import { EventsService } from './service';

export function getRouter() {
	const os = implement(contract).$context<AuthContext>().use(requireAuth);
	const svc = container.get(EventsService);

	return os.router({
		create: os.create.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.create(userId, input);

			return result;
		}),
		get: os.get.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.get(userId, input);

			return result;
		}),
		list: os.list.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.list(userId, input);

			return result;
		}),
		update: os.update.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.update(userId, input);

			return result;
		}),
		delete: os.delete.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.delete(userId, input);

			return result;
		}),
		updateAmenities: os.updateAmenities.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.updateAmenities(userId, input);

			return result;
		}),
		updateFaq: os.updateFaq.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.updateFaq(userId, input);

			return result;
		}),
		updateCategories: os.updateCategories.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.updateCategories(userId, input);

				return result;
			},
		),
		updateTicketOptions: os.updateTicketOptions.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.updateTicketOptions(userId, input);

				return result;
			},
		),
		updateAgenda: os.updateAgenda.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.updateAgenda(userId, input);

			return result;
		}),
		updateLineup: os.updateLineup.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.updateLineup(userId, input);

			return result;
		}),
		createAsset: os.createAsset.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.createAsset(userId, input);

			return result;
		}),
		updateAssets: os.updateAssets.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.updateAssets(userId, input);

			return result;
		}),
		deleteAsset: os.deleteAsset.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.deleteAsset(userId, input);

			return result;
		}),
		addToInterestedEvents: os.addToInterestedEvents.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.addToInterestedEvents(userId, input);

				return result;
			},
		),
		listMyInterestedEvents: os.listMyInterestedEvents.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.listMyInterestedEvents(userId, input);

				return result;
			},
		),
		deleteFromMyInterestedEvents: os.deleteFromMyInterestedEvents.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.deleteFromMyInterestedEvents(userId, input);

				return result;
			},
		),
		listByPlaceId: os.listByPlaceId.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.listByPlaceId(userId, input);

			return result;
		}),
		listByOrganizerId: os.listByOrganizerId.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.listByOrganizerId(userId, input);

				return result;
			},
		),
		listInterestedFriends: os.listInterestedFriends.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.listInterestedFriends(userId, input);

				return result;
			},
		),
	});
}
