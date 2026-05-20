import { Link, useLoaderData, useMatches } from '@tanstack/react-router';
import { ScrollArea, ScrollBar } from '@wanderlust/ui/components/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@wanderlust/ui/components/tabs';
import { cn } from '@wanderlust/ui/lib/utils';

type Props = {
	className?: string;
};

export function UserTabs({ className }: Props) {
	const { profile } = useLoaderData({ from: '/u/$username' });
	const username = profile.username;

	const matches = useMatches();
	const lastMatch = matches[matches.length - 1];

	if (!lastMatch) {
		return null;
	}

	const base = `/u/${username}`;
	const tabs = [
		{ id: '/u/$username/', label: 'Profile', href: `${base}` },
		{
			id: '/u/$username/activities/',
			label: 'Activities',
			href: `${base}/activities`,
		},
		{
			id: '/u/$username/reviews/',
			label: 'Reviews',
			href: `${base}/reviews`,
		},
		{
			id: '/u/$username/lists/',
			label: 'Lists',
			href: `${base}/lists`,
		},
		{
			id: '/u/$username/favorites/',
			label: 'Favorites',
			href: `${base}/favorites`,
		},
	];

	const activeTab = tabs.find((tab) => tab.id === lastMatch.routeId);

	return (
		<div className={cn(className)}>
			<ScrollArea>
				<Tabs value={activeTab?.id} className="my-4 w-full bg-transparent">
					<TabsList className="space-x-4 bg-transparent">
						{tabs.map((t) => (
							<TabsTrigger
								key={t.id}
								value={t.id}
								className="bg-transparent px-1 shadow-none! first-of-type:pl-0"
							>
								<Link
									to={t.href}
									className={cn('text-base', {
										'text-primary underline underline-offset-8':
											activeTab?.id === t.id,
										'hover:text-primary hover:underline hover:decoration-primary hover:underline-offset-8':
											activeTab?.id !== t.id,
									})}
								>
									{t.label}
								</Link>
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>

				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
