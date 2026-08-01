import { Link } from '@tanstack/react-router';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { AppMessage } from '@/components/app-message';
import { useTripCities } from './hooks';

type Props = {
	className?: string;
};

export function CitiesSection({ className }: Props) {
	return (
		<div className={cn('flex flex-col gap-2', className)}>
			<h3 className="font-semibold text-xl tracking-tight">Cities</h3>

			<Separator />

			<Inner />
		</div>
	);
}

function Inner() {
	const cities = useTripCities();

	if (cities.length === 0) {
		return (
			<AppMessage empty="No cities found. Add new items to your itinerary." />
		);
	}

	return (
		<ItemGroup className="grid grid-cols-1 gap-2 md:grid-cols-2">
			{cities.map((city) => (
				<Link to="/cities/$id" params={{ id: city.id }} key={city.id}>
					<Item variant="outline">
						<ItemMedia variant="video">
							<img src={city.image} alt={city.name} />
						</ItemMedia>
						<ItemContent>
							<ItemTitle>{city.name}</ItemTitle>
							<ItemDescription>
								{city.stateName} / {city.countryName}
							</ItemDescription>
						</ItemContent>
					</Item>
				</Link>
			))}
		</ItemGroup>
	);
}
