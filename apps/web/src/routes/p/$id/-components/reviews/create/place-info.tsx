import { useLoaderData } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { useAsset } from '@/hooks/use-asset';
import { ipx } from '@/lib/ipx';

export function PlaceInfo() {
	const { place } = useLoaderData({ from: '/p/$id/' });
	const asset = useAsset(place.assets);

	return (
		<>
			<Image
				src={ipx(asset.url, 'w_512')}
				alt={asset.description ?? ''}
				className="aspect-5/2 w-full rounded-md object-cover md:aspect-video"
				aspectRatio={16 / 9}
				width={512}
			/>
			<div className="my-4 text-center text-muted-foreground">{place.name}</div>
		</>
	);
}
