import { ORPCError, os } from '@orpc/server';
import type { Context } from '@/lib/context';

export const requireAuth = os
	.$context<Context>()
	.middleware(async ({ context, next }) => {
		if (!context.session?.user) {
			throw new ORPCError('UNAUTHORIZED');
		}

		return next({
			context: {
				...context,
				session: context.session,
			},
		});
	});
