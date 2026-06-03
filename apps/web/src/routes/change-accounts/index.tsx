import { createFileRoute, Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { PlusIcon } from 'lucide-react';
import { authClient, authGuard } from '@/lib/auth';
import { ErrorState } from './-error';
import { AccountItem } from './-item';
import { Loading } from './-loading';

export const Route = createFileRoute('/change-accounts/')({
	component: RouteComponent,
	beforeLoad: authGuard,
	loader: async () => {
		const { data, error } = await authClient.multiSession.listDeviceSessions();
		if (error) throw error;
		return data;
	},
});

function RouteComponent() {
	const data = Route.useLoaderData();
	const { data: currentSession, isPending, error } = authClient.useSession();

	if (isPending) {
		return <Loading />;
	}

	if (error) {
		return <ErrorState />;
	}

	return (
		<div className="mx-auto my-16 flex max-w-3xl flex-col">
			<ItemGroup className="gap-6">
				{data.map((item) => (
					<AccountItem
						item={item}
						isCurrentSession={item.user.id === currentSession?.user.id}
						key={item.user.id}
					/>
				))}
			</ItemGroup>
			<div className="mt-4 flex flex-row items-center justify-between gap-16">
				<span className="text-muted-foreground text-sm">
					You can add up to 3 accounts.
				</span>
				<Link
					to="/sign-in"
					disabled={data.length === 3}
					search={{ addSession: true }}
					className={buttonVariants({
						variant: 'default',
						size: 'sm',
						className: cn({
							'cursor-not-allowed bg-primary/50 hover:bg-primary/50!':
								data.length === 3,
						}),
					})}
				>
					<PlusIcon />
					<span>Add Account</span>
				</Link>
			</div>
		</div>
	);
}
