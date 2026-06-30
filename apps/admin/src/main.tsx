import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { queryClient } from './lib/orpc';
import { routeTree } from './routeTree.gen';

import './globals.css';

const router = createRouter({
	routeTree,
	context: {
		queryClient,
	},
	defaultPreload: false,
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
	Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	},
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}

	interface StaticDataRouteOption {
		breadcrumb?: string | ((data: any) => string);
	}
}

const rootElement = globalThis.document.querySelector('#app');

if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>,
	);
}
