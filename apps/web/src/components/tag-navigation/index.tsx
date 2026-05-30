import { ScrollArea, ScrollBar } from '@wanderlust/ui/components/scroll-area';
import { data } from './data';
import { NavItem } from './item';

type Props = {
	cityName?: string;
};

export function TagNavigation({ cityName }: Props) {
	return (
		<ScrollArea className="mt-4 md:mt-8">
			<ul className="flex items-center justify-center space-x-4">
				{data.map((item) => (
					<NavItem key={item.text} {...item} cityName={cityName} />
				))}
			</ul>

			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}
