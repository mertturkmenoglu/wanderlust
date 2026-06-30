import { createFileRoute, Link } from '@tanstack/react-router';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';

export const Route = createFileRoute('/')({
	component: RouteComponent,
});

function RouteComponent() {
	const isAuthenticated = useIsAuthenticated();

	return (
		<div>
			<div>Index</div>
			{isAuthenticated ? (
				<Link to="/dashboard">
					<div>Dashboard</div>
				</Link>
			) : (
				<Link to="/sign-in">
					<div>Sign In</div>
				</Link>
			)}
		</div>
	);
}
