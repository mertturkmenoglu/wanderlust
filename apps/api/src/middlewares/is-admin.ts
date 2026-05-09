import { ORPCError, os } from '@orpc/server';
import { DatabaseService } from '@/db';
import type { AuthContext } from '@/lib/context';

export const isAdmin = os
	.$context<AuthContext>()
	.middleware(async ({ context, next }) => {
		const user = context.session?.user;
		if (!user) {
			throw new ORPCError('UNAUTHORIZED');
		}

		const db = context.container.get(DatabaseService).get();

		const admin = await db.query.admins.findFirst({
			where: (t, { eq }) => eq(t.userId, user.id),
		});

		if (!admin) {
			throw new ORPCError('FORBIDDEN');
		}

		return next({
			context,
		});
	});
