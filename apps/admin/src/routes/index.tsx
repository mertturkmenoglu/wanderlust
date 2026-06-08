import { createFileRoute, redirect } from '@tanstack/react-router';
import { authGuard } from '@/lib/auth';

export const Route = createFileRoute('/')({
	component: RouteComponent,
	beforeLoad: async ({ context: { orpc } }) => {
		const auth = await authGuard();
		const { role } = await orpc.users.getRole.call({});

		if (!auth.auth.user || role !== 'admin') {
			throw redirect({
				to: '/sign-in',
			});
		}

		return auth;
	},
});

function RouteComponent() {
	return <div>Index</div>;
}
