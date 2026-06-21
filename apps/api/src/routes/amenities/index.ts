import { implement } from '@orpc/server';
import { amenities } from '@wanderlust/contract';
import type { Context } from '@/lib/context';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';

export function getRouter() {
	const os = implement(amenities.contract).$context<Context>();

	return os.use(withErrorNormalization).router({
		list: os.list.handler(async () => {
			return {
				amenities: amenities.amenities,
			};
		}),
	});
}
