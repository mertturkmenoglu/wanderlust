import { implement } from '@orpc/server';
import { notifications } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { NotificationsRepository } from './repository';
import { NotificationsService } from './service';

export const module = defineModule({
	exports: [NotificationsService, NotificationsRepository],
	router: () => {
		const os = implement(notifications.contract)
			.$context<AuthContext>()
			.use(requireAuth)
			.use(withErrorNormalization)
			.use(withTracing);

		const svc = container.get(NotificationsService);

		return os.router({
			list: os.list.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.list(userId, input);

				return result;
			}),
			markRead: os.markRead.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.markRead(userId, input);

				return result;
			}),
			markAllRead: os.markAllRead.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.markAllRead(userId, input);

				return result;
			}),
			clear: os.clear.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.clear(userId, input);

				return result;
			}),
			preferences: os.preferences.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.preferences(userId, input);

				return result;
			}),
			updatePreferences: os.updatePreferences.handler(
				async ({ input, context }) => {
					const userId = context.session.user.id;
					const result = await svc.updatePreferences(userId, input);

					return result;
				},
			),
		});
	},
});
