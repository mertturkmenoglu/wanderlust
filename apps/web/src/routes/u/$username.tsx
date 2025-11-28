import { createFileRoute, Outlet } from '@tanstack/react-router';
import { api } from '@/lib/api';
import { Header } from './-components/header';

export const Route = createFileRoute('/u/$username')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			api.queryOptions('get', '/api/v2/users/{username}', {
				params: {
					path: {
						username: params.username,
					},
				},
			}),
		);
	},
});

function RouteComponent() {
	return (
		<div className="mx-auto max-w-7xl">
			<Header className="mt-8" />
			<Outlet />
		</div>
	);
}
