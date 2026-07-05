import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { queryClient as qc } from './lib/orpc';
import { routeTree } from './routeTree.gen';

import './globals.css';
import type { TDataBreadcrumb } from './lib/crud';

const router = createRouter({
	routeTree,
	context: {
		qc,
	},
	defaultPreload: false,
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
	Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
		return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
	},
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}

	interface StaticDataRouteOption {
		breadcrumbs?:
			| (() => TDataBreadcrumb[])
			// biome-ignore lint/suspicious/noExplicitAny: any usage here is intentional
			| ((data: any) => TDataBreadcrumb[]);
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
