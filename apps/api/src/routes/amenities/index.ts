import { implement } from '@orpc/server';
import { amenities } from '@wanderlust/contract';
import type { Context } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';

export const module = defineModule({
	exports: [],
	router: () => {
		const os = implement(amenities.contract)
			.$context<Context>()
			.use(withErrorNormalization);

		return os.router({
			list: os.list.handler(async () => {
				return {
					amenities: amenities.amenities,
				};
			}),
		});
	},
});
