import { ORPCError, os } from '@orpc/server';
import type { AuthContext } from '@/lib/context';

export const isAdmin = os
	.$context<AuthContext>()
	.middleware(async ({ context, next }) => {
		const user = context.session?.user;

		if (!user) {
			throw new ORPCError('UNAUTHORIZED');
		}

		const isAdmin = user.role === 'admin';

		if (!isAdmin) {
			throw new ORPCError('FORBIDDEN');
		}

		return next({
			context,
		});
	});
