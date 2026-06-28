import { implement } from '@orpc/server';
import { preferences } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { PreferencesRepository } from './repository';
import { PreferencesService } from './service';

export const module = defineModule({
	exports: [PreferencesService, PreferencesRepository],
	router: () => {
		const os = implement(preferences.contract)
			.$context<Context>()
			.use(requireAuth)
			.use(withErrorNormalization);

		const svc = container.get(PreferencesService);

		return os.router({
			get: os.get.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.get(userId, input);

				return result;
			}),
			update: os.update.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.update(userId, input);

				return result;
			}),
		});
	},
});
