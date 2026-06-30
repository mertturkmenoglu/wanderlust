import { createFileRoute, Link } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';

export const Route = createFileRoute('/')({
	component: RouteComponent,
});

function RouteComponent() {
	const isAuthenticated = useIsAuthenticated();

	return (
		<Container>
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
		</Container>
	);
}
