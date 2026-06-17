import { ipx } from '@/lib/ipx';
import { useLoaderData } from '@tanstack/react-router';
import { Image } from '@unpic/react';

export function Description() {
	const { city } = useLoaderData({ from: '/cities/$/' });

	return (
		<div className="mt-4 grid grid-cols-5 gap-4 md:mt-8 md:gap-8">
			<div className="col-span-5 lg:col-span-2">
				<div className="">
					<Image
						src={ipx(city.image, 'w_512')}
						alt=""
						className="aspect-video rounded-md object-cover"
						width={512}
						aspectRatio={16 / 9}
					/>
				</div>
			</div>

			<div className="col-span-5 lg:col-span-3">
				<h2 className="font-bold text-3xl md:text-6xl">{city.name}</h2>
				<div className="mt-2 text-muted-foreground text-sm md:font-semibold md:text-base">
					{city.stateName}/{city.countryName}
				</div>
				<div className="mt-4 text-base text-muted-foreground md:text-lg">
					{city.description}
				</div>
			</div>
		</div>
	);
}
