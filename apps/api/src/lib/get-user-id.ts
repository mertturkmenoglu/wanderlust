import type { AuthContext, Context } from './context';

export function getUserId(context: Context | AuthContext): string | null {
	return context.session?.user.id || null;
}

export function getUserIdOrThrow(context: Context | AuthContext): string {
	const userId = getUserId(context);

	if (!userId) {
		throw new Error('User ID not found in context');
	}

	return userId;
}
