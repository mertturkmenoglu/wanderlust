import { Link, useMatches, useParams } from '@tanstack/react-router';
import { ScrollArea, ScrollBar } from '@wanderlust/ui/components/scroll-area';
import { Separator } from '@wanderlust/ui/components/separator';
import { Tabs, TabsList, TabsTrigger } from '@wanderlust/ui/components/tabs';
import { cn } from '@wanderlust/ui/lib/utils';
import { useTabs } from './-hooks';

type Props = {
	className?: string;
};

export function TripTabs({ className }: Props) {
	const { id } = useParams({ from: '/trips/$id' });
	const matches = useMatches();
	const lastMatch = matches.at(-1);

	if (!lastMatch) {
		return null;
	}

	const tabs = useTabs(id);
	const activeTab = tabs.find((t) => t.to === lastMatch.routeId);

	return (
		<div className={cn(className)}>
			<ScrollArea>
				<Tabs
					value={activeTab?.to}
					className="w-full overflow-y-clip bg-transparent"
				>
					<TabsList className="space-x-6 bg-transparent px-0!">
						{tabs.map((t) => (
							<TabsTrigger
								key={t.to}
								value={t.to}
								className="bg-transparent px-0! shadow-none!"
							>
								<Link
									to={t.to}
									params={{ id }}
									className="w-full text-base"
									activeOptions={{
										exact: t.to === '/trips/$id',
									}}
									activeProps={{
										className: 'text-primary underline underline-offset-8',
									}}
									inactiveProps={{
										className:
											'hover:text-primary hover:underline hover:decoration-primary hover:underline-offset-8',
									}}
								>
									{t.title}
								</Link>
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>

				<ScrollBar orientation="horizontal" />
			</ScrollArea>

			<Separator className="-mt-1" />
		</div>
	);
}
