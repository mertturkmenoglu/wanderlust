import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/trips')({
	component: RouteComponent,
	beforeLoad: ({ context: { auth } }) => {
		if (!auth.user) {
			throw redirect({
				to: '/',
			});
		}
	},
});

function RouteComponent() {
	return (
		<div className="mx-auto my-16 max-w-7xl">
			<Outlet />
		</div>
	);
}
