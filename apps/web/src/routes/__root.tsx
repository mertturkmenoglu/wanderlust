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
import { ErrorComponent } from '@/components/error-component';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import type { orpc } from '@/lib/orpc';
import { NotificationsContextProvider } from '@/stores/notifications-context';

interface MyRouterContext {
	queryClient: QueryClient;
	orpc: typeof orpc;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: Component,
	errorComponent: ErrorComponent,
	notFoundComponent: () => {
		return (
			<ErrorComponent
				error={{ name: 'Not Found', message: 'Page not found' }}
				reset={() => {
					// do nothing
				}}
			/>
		);
	},
	head: () => ({
		meta: [
			{
				title: 'Wanderlust',
			},
			{
				name: 'description',
				content: 'Inspiring explorations, one spark of Wanderlust!',
			},
		],
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
		<NotificationsContextProvider>
			<HeadContent />
			<div className="flex min-h-screen flex-col">
				<Header />
				<main className="flex-1">
					<Outlet />
				</main>
				<Footer />
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
		</NotificationsContextProvider>
	);
}
