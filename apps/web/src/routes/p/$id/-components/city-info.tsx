import { getRouteApi } from '@tanstack/react-router';
import { CollapsibleText } from '@/components/blocks/collapsible-text';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';

type Props = {
	className?: string;
};

export function CityInfo({ className }: Props) {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();

	return (
		<div className={cn(className)}>
			<div className="grid grid-cols-3 gap-8 md:gap-16">
				<div className="col-span-3 md:col-span-1">
					<img
						src={ipx(place.address.city.image, 'f_webp,w_1024')}
						alt=""
						className="aspect-video rounded-md object-cover"
					/>
				</div>

				<div className="col-span-3 md:col-span-2">
					<h2 className="font-bold text-4xl">{place.address.city.name}</h2>
					<div className="mt-2 text-muted-foreground text-sm">
						{place.address.city.stateName}/{place.address.city.countryName}
					</div>
					<CollapsibleText
						text={place.address.city.description}
						charLimit={600}
					/>
				</div>
			</div>
		</div>
	);
}
