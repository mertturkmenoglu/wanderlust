import { trace } from '@opentelemetry/api';
import { ORPCError, os } from '@orpc/server';
import type { Context } from '@/lib/context';

export const requireAuth = os
	.$context<Context>()
	.middleware(async ({ context, next }) => {
		const span = trace.getActiveSpan();

		if (!context.session?.user) {
			throw new ORPCError('UNAUTHORIZED');
		}

		// Redact email address from the user object before logging it to avoid leaking sensitive information.
		const {
			user: { email, ...user },
		} = context.session;

		span?.setAttribute('auth.user.id', user.id);
		span?.setAttribute('auth.user.username', user.username);
		span?.setAttribute('auth.user.banned', user.banned ? 'true' : 'false');
		span?.setAttribute('auth.user.role', user.role ?? 'user');

		return next({
			context: {
				...context,
				session: context.session,
			},
		});
	});

Object.defineProperty(requireAuth, 'name', {
	value: 'requireAuth',
});
