import type { QueryClient } from '@tanstack/react-query';
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';
import { ErrorComponent } from '@/components/blocks/error-component';
import { Footer } from '@/components/blocks/footer';
import { Header } from '@/components/blocks/header';
import type { orpc } from '@/lib/orpc';
import type { FlagsResponse } from '@/providers/flags-provider';

interface MyRouterContext {
	queryClient: QueryClient;
	flags: FlagsResponse;
	orpc: typeof orpc;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: Component,
	loader: ({ context: { flags } }) => {
		const isRedirect = flags.flags['redirect-to-wip'] === true;

		if (isRedirect && globalThis.window.location.pathname !== '/wip') {
			globalThis.window.location.href = '/wip';
		}
	},
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
