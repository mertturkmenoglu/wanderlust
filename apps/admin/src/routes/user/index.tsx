import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Badge } from '@wanderlust/ui/components/badge';
import { Button } from '@wanderlust/ui/components/button';
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@wanderlust/ui/components/card';
import { Container } from '@/components/container';
import { authClient, authGuard } from '@/lib/auth';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/user/')({
	component: RouteComponent,
	beforeLoad: authGuard,
	loader: async ({ context }) => {
		return context.qc.ensureQueryData(
			orpc.users.getMe.queryOptions({
				input: {},
				staleTime: 1000 * 60 * 5, // 5 minutes
			}),
		);
	},
	staticData: {
		breadcrumbs: () => [
			{
				label: 'Profile',
				link: {
					to: '/user',
				} as const,
			},
		],
	},
});

function RouteComponent() {
	const { profile } = Route.useLoaderData();

	const mutation = useMutation({
		mutationKey: ['sign-out'],
		mutationFn: async () => {
			await authClient.signOut({
				fetchOptions: {
					throw: true,
				},
			});
		},
		onSuccess: () => {
			globalThis.window.location.href = '/sign-in';
		},
	});

	return (
		<Container title="User Profile" className="">
			<div className="mx-auto w-full max-w-xl">
				<Card>
					<CardHeader>
						<CardTitle>{profile.name}</CardTitle>
						<CardDescription>@{profile.username}</CardDescription>
						<CardDescription>
							ID: <Badge variant="secondary">{profile.id}</Badge>
						</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button
							variant="destructive"
							className="ml-auto"
							onClick={() => mutation.mutate()}
						>
							Sign Out
						</Button>
					</CardFooter>
				</Card>
			</div>
		</Container>
	);
}
