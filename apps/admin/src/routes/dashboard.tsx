import { createFileRoute, Outlet } from '@tanstack/react-router';
import { authGuard } from '@/lib/auth';

export const Route = createFileRoute('/dashboard')({
	component: RouteComponent,
	beforeLoad: authGuard,
	staticData: {
		breadcrumbs: () => [
			{
				label: 'Dashboard',
				link: {
					to: '/dashboard',
				} as const,
			},
		],
	},
});

function RouteComponent() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
