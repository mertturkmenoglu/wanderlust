import { implement } from '@orpc/server';
import { Preferences } from '@wanderlust/contract';
import type { Context } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';

export const os = implement(Preferences.Contract)
	.$context<Context>()
	.use(requireAuth)
	.use(withErrorNormalization)
	.use(withTracing);
