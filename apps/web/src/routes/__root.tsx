import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';
import { ErrorComponent } from '@/components/error-component';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import { useSyncPreferences } from '@/hooks/use-sync-preferences';
import { NotificationsContextProvider } from '@/stores/notifications-context';
import appCss from '../globals.css?url';

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootComponent,
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
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				name: 'theme-color',
				content: '#18815e',
			},
			{
				name: 'og:title',
				content: 'Wanderlust',
			},
			{
				name: 'og:description',
				content: 'Inspiring explorations, one spark of Wanderlust!',
			},
			{
				name: 'og:image',
				content:
					'https://raw.githubusercontent.com/mertturkmenoglu/wanderlust/refs/heads/main/apps/web/public/logo.png',
			},
			{
				name: 'og:url',
				content: 'https://wanderlust.mertturkmenoglu.com/',
			},
			{
				name: 'twitter:title',
				content: 'Wanderlust',
			},
			{
				name: 'twitter:description',
				content: 'Inspiring explorations, one spark of Wanderlust!',
			},
			{
				name: 'twitter:image',
				content:
					'https://raw.githubusercontent.com/mertturkmenoglu/wanderlust/refs/heads/main/apps/web/public/logo.png',
			},
			{
				name: 'twitter:card',
				content: 'summary_large_image',
			},
			{
				name: 'twitter:creator',
				content: '@AsyncSquirrel',
			},
			{
				name: 'twitter:url',
				content: 'https://wanderlust.mertturkmenoglu.com/',
			},
		],
		links: [
			{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
			{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: '' },
			{ rel: 'stylesheet', href: appCss },
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
			},
			{
				rel: 'icon',
				href: '/favicon.ico',
			},
			{
				rel: 'apple-touch-icon',
				href: '/logo.png',
			},
			{
				rel: 'manifest',
				href: '/manifest.json',
			},
		],
	}),
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: PropsWithChildren) {
	useSyncPreferences();

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>

			<body>
				<NotificationsContextProvider>
					<ThemeProvider
						attribute="class"
						storageKey="wl-theme"
						defaultTheme="light"
					>
						<div className="mx-4 flex min-h-screen flex-col">
							<Header className="shrink-0" />

							<main className="flex min-h-0 flex-1 flex-col overflow-hidden">
								{children}
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
						<Scripts />
					</ThemeProvider>
				</NotificationsContextProvider>
			</body>
		</html>
	);
}
