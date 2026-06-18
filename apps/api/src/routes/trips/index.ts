import { implement } from '@orpc/server';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { contract } from './contract';
import { TripsRepository } from './repository';
import { TripsService } from './service';

export function getRouter() {
	const os = implement(contract).$context<AuthContext>().use(requireAuth);
	const svc = container.get(TripsService);

	return os
		.use(withErrorNormalization)
		.router({
			get: os.get.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.get(userId, input);

				return result;
			}),
			listInvites: os.listInvites.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.listInvites(userId, input);

				return result;
			}),
			createInvite: os.createInvite.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.createInvite(userId, input);

				return result;
			}),
			list: os.list.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.list(userId, input);

				return result;
			}),
			listMyInvites: os.listMyInvites.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.listMyInvites(userId, input);

				return result;
			}),
			create: os.create.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.create(userId, input);

				return result;
			}),
			getInviteDetails: os.getInviteDetails.handler(
				async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.getInviteDetails(userId, input);

					return result;
				},
			),
			acceptOrDeclineInvite: os.acceptOrDeclineInvite.handler(
				async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.acceptOrDeclineInvite(userId, input);

					return result;
				},
			),
			leave: os.leave.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				await svc.leave(userId, input);

				return {};
			}),
			deleteInvite: os.deleteInvite.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				await svc.deleteInvite(userId, input);

				return {};
			}),
			delete: os.delete.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				await svc._delete(userId, input);

				return {};
			}),
			deleteParticipant: os.deleteParticipant.handler(
				async ({ input, context }) => {
					const userId = context.session.user.id;
					await svc.deleteParticipant(userId, input);

					return {};
				},
			),
			createComment: os.createComment.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.createComment(userId, input);

				return result;
			}),
			listComments: os.listComments.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.listComments(userId, input);

				return result;
			}),
			updateComment: os.updateComment.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.updateComment(userId, input);

				return result;
			}),
			deleteComment: os.deleteComment.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				await svc.deleteComment(userId, input);

				return {};
			}),
			update: os.update.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.update(userId, input);

				return result;
			}),
			createLocation: os.createLocation.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.createLocation(userId, input);

				return result;
			}),
			updateLocation: os.updateLocation.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.updateLocation(userId, input);

				return result;
			}),
			deleteLocation: os.deleteLocation.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				await svc.deleteLocation(userId, input);

				return {};
			}),
			updateRequestedAmenities: os.updateRequestedAmenities.handler(
				async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.updateRequestedAmenities(userId, input);

					return result;
				},
			),
			getSummary: os.getSummary.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.getSummary(userId, input);

				return result;
			}),
		});
}

export const module = new ContainerModule(({ bind }) => {
	bind(TripsService).toSelf();
	bind(TripsRepository).toSelf();
});
