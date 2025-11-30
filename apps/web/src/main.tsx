/** biome-ignore-all lint/style/noNonNullAssertion: We are sure these values will be defined */
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { FlagsContextProvider } from './providers/flags-provider.tsx';
import reportWebVitals from './reportWebVitals.ts';
import { routeTree } from './routeTree.gen.ts';

import 'instantsearch.css/themes/reset.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';
import './styles.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { Spinner } from './components/ui/spinner.tsx';
import { orpc, queryClient } from './lib/orpc';

const router = createRouter({
	routeTree,
	context: {
		flags: undefined!,
		orpc,
		queryClient,
	},
	defaultPreload: false,
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
	defaultPendingComponent: () => <Spinner />,
	Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>
				<FlagsContextProvider>{children}</FlagsContextProvider>
			</QueryClientProvider>
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

reportWebVitals();
