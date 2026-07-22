import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { ScrollArea, ScrollBar } from '@wanderlust/ui/components/scroll-area';
import { useAssetLightbox } from '@/hooks/use-asset-lightbox';
import { orpc } from '@/lib/orpc';

export function Assets() {
	const params = useParams({ from: '/p/$id/reviews/' });

	const query = useSuspenseQuery(
		orpc.reviews.listAssetsByPlaceId.queryOptions({
			input: {
				id: params.id,
			},
		}),
	);

	const assets = query.data.assets;

	const lb = useAssetLightbox(assets);

	if (assets.length === 0) {
		return null;
	}

	return (
		<div className="my-8">
			<lb.Component />

			<ScrollArea>
				<div className="mb-4 flex flex-row gap-4">
					{assets.map((asset, i) => (
						<button type="button" key={asset.url} onClick={() => lb.openAt(i)}>
							<img
								src={asset.url}
								alt={asset.alt ?? ''}
								className="aspect-video w-32 min-w-32! rounded object-cover"
							/>
						</button>
					))}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
