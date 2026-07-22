import { implement } from '@orpc/server';
import { Assets } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { AssetsRepository } from './repository';
import { AssetsService } from './service';

export const module = defineModule({
	exports: [AssetsService, AssetsRepository],
	router: () => {
		const os = implement(Assets.Contract)
			.$context<AuthContext>()
			.use(withErrorNormalization)
			.use(withTracing)
			.use(requireAuth);

		const svc = container.get(AssetsService);

		return os.router({
			create: os.create.handler(async ({ input, context }) => {
				const userId = getUserIdOrThrow(context);
				const result = await svc.create(userId, input);

				return result;
			}),
		});
	},
});
