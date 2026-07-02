import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/nearby')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="my-4 flex h-[calc(100dvh-4.5rem-4rem)] flex-col overflow-hidden">
			<Outlet />
		</div>
	);
}
