import { ScrollArea, ScrollBar } from '@wanderlust/ui/components/scroll-area';
import { cn } from '@wanderlust/ui/lib/utils';
import { MinimalPlaceCard } from '@/components/place-card/minimal';
import { useRecentViews } from '@/hooks/use-recent-views';

type Props = {
	className?: string;
};

export function RecentlyViewed({ className }: Props) {
	const [recentViews] = useRecentViews();

	if (recentViews.length === 0) {
		return null;
	}

	return (
		<div className={cn(className)}>
			<h2 className="text-accent-foreground text-lg tracking-tighter md:text-2xl">
				Recently Viewed
			</h2>

			<ScrollArea>
				<div className="my-4 flex gap-8">
					{recentViews.map((item) => (
						<MinimalPlaceCard
							key={item.id}
							className="w-[256px]"
							place={item}
							as="link"
						/>
					))}
				</div>

				<ScrollBar orientation="horizontal" className="mt-8" />
			</ScrollArea>
		</div>
	);
}
