import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { routeTree } from './routeTree.gen';

import './globals.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { ErrorComponent } from './components/error-component';
import { orpc, queryClient } from './lib/orpc';

const router = createRouter({
	routeTree,
	context: {
		orpc,
		queryClient,
	},
	defaultPreload: false,
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
	defaultPendingComponent: () => <Spinner />,
	defaultErrorComponent: ({ error }) => (
		<ErrorComponent error={error} reset={() => {}} />
	),
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
