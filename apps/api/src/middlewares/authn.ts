import { redact } from '@arcjet/redact';
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

		const [user] = await redact(JSON.stringify(context.session.user), {
			entities: ['email'],
		});

		span?.setAttribute('auth.user', user);

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
