import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/sign-in')({
	component: RouteComponent,
	loader: () => {
		throw redirect({
			href: 'http://localhost:3000/sign-in',
		});
	},
});

function RouteComponent() {
	return null;
}
