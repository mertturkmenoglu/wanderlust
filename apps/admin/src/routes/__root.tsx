import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { SidebarProvider } from '@wanderlust/ui/components/sidebar';
import { Toaster } from 'sonner';
import { AppSidebar } from '@/components/app-sidebar';
import { ErrorComponent } from '@/components/error-component';
import type { orpc } from '@/lib/orpc';

interface MyRouterContext {
	queryClient: QueryClient;
	orpc: typeof orpc;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: Component,
	errorComponent: ErrorComponent,
	head: () => ({
		links: [
			{
				rel: 'icon',
				href: '/favicon.ico',
			},
		],
	}),
});

function Component() {
	return (
		<>
			<HeadContent />
			<div className="flex min-h-screen flex-col">
				<main className="flex-1">
					<div className="grid h-svh grid-rows-[auto_1fr]">
						<SidebarProvider>
							<AppSidebar />

							<div className="w-full p-8">
								<Outlet />
							</div>
						</SidebarProvider>
					</div>
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
