/** biome-ignore-all lint/style/noNonNullAssertion: We are sure these values will be defined */
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode, useContext } from 'react';
import ReactDOM from 'react-dom/client';

import * as TanstackQuery from './integrations/tanstack-query/root-provider.tsx';

// Import the generated route tree
import { routeTree } from './routeTree.gen.ts';

import 'instantsearch.css/themes/reset.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';
import { Spinner } from './components/kit/spinner.tsx';
import {
	AuthContext,
	AuthContextProvider,
} from './providers/auth-provider.tsx';
import {
	FlagsContext,
	FlagsContextProvider,
} from './providers/flags-provider.tsx';
import reportWebVitals from './reportWebVitals.ts';
import './styles.css';
import 'maplibre-gl/dist/maplibre-gl.css';

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		...TanstackQuery.getContext(),
		auth: undefined!,
		flags: undefined!,
	},
	defaultPreload: false,
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

function App() {
	return (
		<FlagsContextProvider>
			<AuthContextProvider>
				<InnerApp />
			</AuthContextProvider>
		</FlagsContextProvider>
	);
}

function InnerApp() {
	const auth = useContext(AuthContext);
	const flags = useContext(FlagsContext);

	if (auth.isLoading && !auth.user) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Spinner className="size-12 animate-spin fill-primary text-gray-200" />
			</div>
		);
	}

	return (
		<RouterProvider router={router} context={{ auth, flags: flags.flags }} />
	);
}

// Render the app
const rootElement = globalThis.document.querySelector('#app');
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<TanstackQuery.Provider>
				<App />
			</TanstackQuery.Provider>
		</StrictMode>,
	);
}

reportWebVitals();
