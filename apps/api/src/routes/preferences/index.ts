import { implement } from '@orpc/server';
import { preferences } from '@wanderlust/contract';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { PreferencesRepository } from './repository';
import { PreferencesService } from './service';

export function getRouter() {
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
}

export const module = new ContainerModule(({ bind }) => {
	bind(PreferencesService).toSelf();
	bind(PreferencesRepository).toSelf();
});
