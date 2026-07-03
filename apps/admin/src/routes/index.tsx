import { createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '@/lib/auth';

export const Route = createFileRoute('/')({
	beforeLoad: async () => {
		const auth = await authClient.getSession();

		if (!auth) {
			throw redirect({
				to: '/sign-in',
			});
		}

		throw redirect({
			to: '/dashboard',
		});
	},
});
