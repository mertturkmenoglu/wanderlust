import { implement } from '@orpc/server';
import { Collections } from '@wanderlust/contract';
import type { Context } from '@/lib/context';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';

export const os = implement(Collections.Contract)
	.$context<Context>()
	.use(withErrorNormalization)
	.use(withTracing);
