import { implement } from '@orpc/server';
import type { Context } from '@/lib/context';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { amenities } from './consts';
import { contract } from './contract';

export function getRouter() {
	const os = implement(contract).$context<Context>();

	return os.use(withErrorNormalization).router({
		list: os.list.handler(async () => {
			return {
				amenities,
			};
		}),
	});
}
