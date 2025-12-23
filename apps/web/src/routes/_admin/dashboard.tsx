import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { authGuard } from '@/lib/auth';

export const Route = createFileRoute('/_admin/dashboard')({
	component: RouteComponent,
	beforeLoad: async ({ context: { orpc } }) => {
		const isDev = import.meta.env.DEV;
		const auth = await authGuard();
		const { role } = await orpc.users.getRole.call({});

		if (!isDev || !auth.auth.user || role !== 'admin') {
			throw redirect({
				to: '/',
			});
		}
		return auth;
	},
});

function RouteComponent() {
	return (
		<div className="mx-auto my-8 max-w-7xl">
			<Outlet />
		</div>
	);
}
