import { createFileRoute, Outlet } from '@tanstack/react-router';
import { authGuard } from '@/lib/auth';
import { Sidebar } from './settings/-components/sidebar';

export const Route = createFileRoute('/settings')({
	component: RouteComponent,
	beforeLoad: authGuard,
});

function RouteComponent() {
	return (
		<div className="mx-auto mt-8 w-full max-w-7xl">
			<h2 className="text-2xl">Settings</h2>
			<div className="mt-4 flex flex-col gap-4 md:mt-8 md:flex-row">
				<div className="min-w-xs md:pr-8">
					<Sidebar />
				</div>
				<div className="flex-1 md:-mt-4">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
