import { createFileRoute, Outlet } from '@tanstack/react-router';
import { authGuard } from '@/lib/auth';

export const Route = createFileRoute('/trips')({
	component: RouteComponent,
	beforeLoad: authGuard,
	ssr: false,
});

function RouteComponent() {
	return (
		<div className="mx-auto my-8 w-full max-w-7xl">
			<Outlet />
		</div>
	);
}
