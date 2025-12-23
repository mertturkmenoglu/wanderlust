import type { QueryClient } from '@tanstack/react-query';
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';
import { ErrorComponent } from '@/components/error-component';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import type { orpc } from '@/lib/orpc';

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
		<>
			<HeadContent />
			<div className="flex min-h-screen flex-col">
				<Header />
				<main className="flex-1">
					<Outlet />
				</main>
				<Footer />
				<TanStackRouterDevtools position="bottom-left" />
				<Toaster position="bottom-center" richColors />
			</div>
		</>
	);
}
