import { implement } from '@orpc/server';
import { DbProvider } from '@/db';
import { ioc } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { contract } from './contract';
import { TripsRepository } from './repository';
import { TripsService } from './service';

export function getRouter() {
	const os = implement(contract).$context<AuthContext>().use(requireAuth);
	const db = ioc.resolve(DbProvider.id);
	const repo = new TripsRepository(db);
	const service = new TripsService(repo);

	return os.router({
		get: os.get.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.get(userId, input);

			return result;
		}),
		listInvites: os.listInvites.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.listInvites(userId, input);

			return result;
		}),
		createInvite: os.createInvite.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.createInvite(userId, input);

			return result;
		}),
		list: os.list.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.list(userId, input);

			return result;
		}),
		listMyInvites: os.listMyInvites.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.listMyInvites(userId, input);

			return result;
		}),
		create: os.create.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.create(userId, input);

			return result;
		}),
		getInviteDetails: os.getInviteDetails.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await service.getInviteDetails(userId, input);

				return result;
			},
		),
		acceptOrDeclineInvite: os.acceptOrDeclineInvite.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await service.acceptOrDeclineInvite(userId, input);

				return result;
			},
		),
		leave: os.leave.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			await service.leave(userId, input);

			return {};
		}),
		deleteInvite: os.deleteInvite.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			await service.deleteInvite(userId, input);

			return {};
		}),
		delete: os.delete.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			await service._delete(userId, input);

			return {};
		}),
		deleteParticipant: os.deleteParticipant.handler(
			async ({ input, context }) => {
				const userId = context.session.user.id;
				await service.deleteParticipant(userId, input);

				return {};
			},
		),
		createComment: os.createComment.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.createComment(userId, input);

			return result;
		}),
		listComments: os.listComments.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.listComments(userId, input);

			return result;
		}),
		updateComment: os.updateComment.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.updateComment(userId, input);

			return result;
		}),
		deleteComment: os.deleteComment.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			await service.deleteComment(userId, input);

			return {};
		}),
		update: os.update.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.update(userId, input);

			return result;
		}),
		createLocation: os.createLocation.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.createLocation(userId, input);

			return result;
		}),
		updateLocation: os.updateLocation.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.updateLocation(userId, input);

			return result;
		}),
		deleteLocation: os.deleteLocation.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			await service.deleteLocation(userId, input);

			return {};
		}),
	});
}
