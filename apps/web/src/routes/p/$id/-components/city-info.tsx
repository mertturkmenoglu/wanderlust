import { getRouteApi } from '@tanstack/react-router';
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
			<div className="grid grid-cols-5 gap-8">
				<div className="col-span-5 md:col-span-2">
					<img
						src={ipx(place.address.city.image, 'f_webp,w_1024')}
						alt=""
						className="aspect-video rounded-md object-cover"
					/>
				</div>

				<div className="col-span-5 md:col-span-3">
					<h2 className="font-bold text-6xl">{place.address.city.name}</h2>
					<div className="mt-2 text-muted-foreground text-sm">
						{place.address.city.state.name}/{place.address.city.country.name}
					</div>
					<div className="mt-4 text-lg text-muted-foreground">
						{place.address.city.description}
					</div>
				</div>
			</div>
		</div>
	);
}
