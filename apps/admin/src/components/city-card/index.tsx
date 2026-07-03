import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import type { Outputs } from '@/lib/orpc';

type Props = {
	className?: string;
	city: Outputs['cities']['get']['city'];
	children?: React.ReactNode;
};

export function CityCard({ className, city, children }: Props) {
	return (
		<Item variant="outline" className={cn(className)}>
			<ItemMedia variant="video">
				<img src={city.image} alt={city.name} />
			</ItemMedia>
			<ItemContent>
				<ItemTitle>{city.name}</ItemTitle>
				<ItemDescription>
					{city.stateName} / {city.countryName}
				</ItemDescription>
			</ItemContent>

			{children && <ItemActions>{children}</ItemActions>}
		</Item>
	);
}
