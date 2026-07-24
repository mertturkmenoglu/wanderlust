import { implement } from '@orpc/server';
import { Trips } from '@wanderlust/contract';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';

export const os = implement(Trips.Contract)
	.$context<AuthContext>()
	.use(requireAuth)
	.use(withErrorNormalization)
	.use(withTracing);
