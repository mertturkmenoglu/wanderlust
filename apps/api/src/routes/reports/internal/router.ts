import { implement } from '@orpc/server';
import { Reports } from '@wanderlust/contract';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';

export const os = implement(Reports.Contract)
	.$context<AuthContext>()
	.use(requireAuth)
	.use(withErrorNormalization)
	.use(withTracing);
