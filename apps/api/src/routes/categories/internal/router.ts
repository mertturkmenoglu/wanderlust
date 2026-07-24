import { implement } from '@orpc/server';
import { Categories } from '@wanderlust/contract';
import type { Context } from '@/lib/context';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';

export const os = implement(Categories.Contract)
	.$context<Context>()
	.use(withErrorNormalization)
	.use(withTracing);

export type Router = typeof os;
