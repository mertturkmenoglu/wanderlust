import {
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from '@tanstack/react-router';
import { render } from 'vitest-browser-react';

/**
 * Renders `ui` inside a TanStack Router context so components using
 * `Link`, `useRouter`, etc. don't crash with "Cannot read properties
 * of null (reading 'isServer')" when rendered in isolation.
 *
 * A catch-all route means any `to` the component links to resolves,
 * without needing to declare routes per test.
 */
export function renderWithRouter(ui: React.ReactElement) {
	const rootRoute = createRootRoute({
		component: () => ui,
	});
	const catchAllRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: '$',
	});
	const router = createRouter({
		routeTree: rootRoute.addChildren([catchAllRoute]),
	});

	return render(<RouterProvider router={router} />);
}
