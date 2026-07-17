import { implement } from '@orpc/server';
import { Trips } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { TripsRepository } from './repository';
import { TripsService } from './service';

export const module = defineModule({
	exports: [TripsService, TripsRepository],
	router: () => {
		const os = implement(Trips.Contract)
			.$context<AuthContext>()
			.use(requireAuth)
			.use(withErrorNormalization)
			.use(withTracing);

		const svc = container.get(TripsService);

		return os.router({
			list: os.list.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.list(userId, input);

				return result;
			}),
			get: os.get.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.get(userId, input);

				return result;
			}),
			create: os.create.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.create(userId, input);

				return result;
			}),
			leave: os.leave.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				await svc.leave(userId, input);

				return {};
			}),
			delete: os.delete.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				await svc._delete(userId, input);

				return {};
			}),
			update: os.update.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.update(userId, input);

				return result;
			}),

			invites: {
				list: os.invites.list.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.listInvites(userId, input);

					return result;
				}),
				create: os.invites.create.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.createInvite(userId, input);

					return result;
				}),
				listMine: os.invites.listMine.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.listMyInvites(userId, input);

					return result;
				}),
				getDetails: os.invites.getDetails.handler(
					async ({ input, context }) => {
						const userId = context.session.user.id;
						const result = await svc.getInviteDetails(userId, input);

						return result;
					},
				),
				delete: os.invites.delete.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					await svc.deleteInvite(userId, input);

					return {};
				}),
				respond: os.invites.respond.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.acceptOrDeclineInvite(userId, input);

					return result;
				}),
			},

			participants: {
				delete: os.participants.delete.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					await svc.deleteParticipant(userId, input);

					return {};
				}),
			},

			comments: {
				create: os.comments.create.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.createComment(userId, input);

					return result;
				}),
				list: os.comments.list.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.listComments(userId, input);

					return result;
				}),
				update: os.comments.update.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.updateComment(userId, input);

					return result;
				}),
				delete: os.comments.delete.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					await svc.deleteComment(userId, input);

					return {};
				}),
			},

			locations: {
				create: os.locations.create.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.createLocation(userId, input);

					return result;
				}),
				update: os.locations.update.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.updateLocation(userId, input);

					return result;
				}),
				delete: os.locations.delete.handler(async ({ input, context }) => {
					const userId = context.session.user.id;
					await svc.deleteLocation(userId, input);

					return {};
				}),
			},

			getSummary: os.getSummary.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.getSummary(userId, input);

				return result;
			}),
		});
	},
});
