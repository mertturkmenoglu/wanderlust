import { implement } from '@orpc/server';
import { Assets } from '@wanderlust/contract';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';

export const os = implement(Assets.Contract)
	.$context<AuthContext>()
	.use(withErrorNormalization)
	.use(withTracing)
	.use(requireAuth);
