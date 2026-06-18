import { ScrollArea, ScrollBar } from '@wanderlust/ui/components/scroll-area';
import { cn } from '@wanderlust/ui/lib/utils';
import { data } from './data';
import { NavItem } from './item';

type Props = {
	cityName?: string;
	className?: string;
};

export function TagNavigation({ cityName, className }: Props) {
	return (
		<ScrollArea className={cn(className)}>
			<ul className="flex items-center justify-center space-x-4">
				{data.map((item) => (
					<NavItem key={item.text} {...item} cityName={cityName} />
				))}
			</ul>

			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}
