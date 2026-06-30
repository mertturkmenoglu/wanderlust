import { createFileRoute, Outlet } from '@tanstack/react-router';
import { authGuard } from '@/lib/auth';

export const Route = createFileRoute('/dashboard')({
	component: RouteComponent,
	beforeLoad: authGuard,
	staticData: {
		breadcrumb: 'Dashboard',
	},
});

function RouteComponent() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
