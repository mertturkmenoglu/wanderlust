import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: Component,
	head: () => ({
		links: [
			{
				rel: 'icon',
				href: '/favicon.ico',
			},
		],
	}),
	staticData: {
		breadcrumb: 'Home',
	},
});

function Component() {
	return (
		<>
			<HeadContent />

			<div className="flex min-h-screen flex-col">
				<main className="flex-1">
					<Outlet />
				</main>

				<TanStackDevtools
					plugins={[
						{
							name: 'TanStack Query',
							render: <ReactQueryDevtoolsPanel />,
						},
						{
							name: 'TanStack Router',
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>

				<Toaster position="bottom-center" richColors />
			</div>
		</>
	);
}
