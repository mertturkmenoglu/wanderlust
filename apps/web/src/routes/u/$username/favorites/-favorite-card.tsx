import { Image } from '@unpic/react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@wanderlust/ui/components/card';
import { ipx } from '@/lib/ipx';
import type { Outputs } from '@/lib/orpc';

type Props = {
	favorite: Outputs['favorites']['list']['favorites'][number];
};

export function FavoriteCard({ favorite: { place } }: Props) {
	const image = place.assets[0];

	return (
		<Card className="group flex flex-col py-0 md:flex-row">
			<Image
				src={ipx(image?.url ?? '', '256')}
				alt={image?.description ?? ''}
				className="aspect-video w-full rounded-t-md object-cover md:w-32 md:rounded-none md:rounded-l-md lg:w-32 2xl:w-64"
				layout="constrained"
				width={256}
				aspectRatio={16 / 9}
			/>

			<div className="w-full py-6">
				<CardHeader className="w-full">
					<CardTitle className="line-clamp-1 capitalize" title={place.name}>
						{place.name}
					</CardTitle>
					<CardDescription className="line-clamp-1">
						{place.address.city.name} / {place.address.city.countryName}
					</CardDescription>
				</CardHeader>

				<CardContent className="mt-4">
					<p className="line-clamp-1 text-primary text-sm leading-none">
						{place.category.name}
					</p>
				</CardContent>
			</div>
		</Card>
	);
}
