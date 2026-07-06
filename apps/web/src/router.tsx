import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import 'instantsearch.css/themes/reset.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { ErrorComponent } from './components/error-component';
import { createQueryClient } from './lib/query-client';

export function getRouter() {
	const qc = createQueryClient();

	const router = createRouter({
		routeTree,
		context: {
			queryClient: qc,
		},
		defaultPreload: false,
		scrollRestoration: true,
		defaultStructuralSharing: true,
		defaultPreloadStaleTime: 0,
		defaultPendingComponent: () => (
			<div className="mx-auto my-16">
				<Spinner className="size-12" />
			</div>
		),
		defaultErrorComponent: ({ error }) => (
			<ErrorComponent error={error} reset={() => {}} />
		),
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: qc,
	});

	return router;
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
