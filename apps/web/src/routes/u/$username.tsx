import { createFileRoute, Outlet } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';
import { Header } from './-components/header';

export const Route = createFileRoute('/u/$username')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			orpc.users.get.queryOptions({
				input: {
					username: params.username,
				},
			}),
		);
	},
});

function RouteComponent() {
	return (
		<div className="mx-auto w-full max-w-7xl">
			<Header className="mt-8" />
			<Outlet />
		</div>
	);
}
