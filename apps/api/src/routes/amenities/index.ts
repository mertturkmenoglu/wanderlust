import { implement } from '@orpc/server';
import { Amenities } from '@wanderlust/contract';
import type { Context } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';

export const module = defineModule({
	exports: [],
	router: () => {
		const os = implement(Amenities.Contract)
			.$context<Context>()
			.use(withErrorNormalization)
			.use(withTracing);

		return os.router({
			list: os.list.handler(async () => {
				return {
					amenities: Amenities.values,
				};
			}),
		});
	},
});
