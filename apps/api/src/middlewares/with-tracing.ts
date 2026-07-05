import { os } from '@orpc/server';
import { wrap } from '@/lib/tracer';

export const withTracing = os.middleware(async ({ path, next }) => {
	return wrap(`router.${path.join('.')}`, async () => {
		return next();
	});
});
