import { getRouteApi } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { CollapsibleText } from '@/components/collapsible-text';
import { ipx } from '@/lib/ipx';

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
					<Image
						src={ipx(place.address.city.image, 'w_512')}
						alt=""
						className="aspect-video rounded-md object-cover"
						layout="constrained"
						width={512}
						aspectRatio={16 / 9}
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
