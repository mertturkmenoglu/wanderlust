import { getRouteApi } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { GripHorizontalIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useAssetLightbox } from '@/hooks/use-asset-lightbox';
import { ipx } from '@/lib/ipx';

type Props = {
	className?: string;
};

export function ImageGrid({ className }: Props) {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();
	const images = place.assets;
	const first = images[0];

	const rest = useMemo(() => {
		const slice = images.slice(1, 5) as {
			id: number;
			url: string;
			description: string;
		}[];

		if (slice.length < 4) {
			const pad = 4 - slice.length;

			for (let i = 0; i < pad; i += 1) {
				slice.push({
					id: Math.random(),
					url: '',
					description: '',
				});
			}
		}
		return slice;
	}, [images]);

	const lb = useAssetLightbox(images);

	if (!first) {
		return null;
	}

	return (
		<div
			className={cn(
				'relative grid h-64 grid-cols-4 grid-rows-2 gap-2 rounded-xl md:h-96 lg:h-128',
				className,
			)}
		>
			<div className="col-span-2 row-span-2">
				<button
					type="button"
					className="h-full w-full rounded-l-xl object-cover"
					onClick={() => lb.openAt(0)}
				>
					<Image
						src={ipx(first.url, 'w_1024')}
						alt={first.description ?? ''}
						className="h-full w-full rounded-l-xl object-cover"
						layout="constrained"
						width={1024}
						aspectRatio={16 / 9}
					/>
				</button>
			</div>
			{rest.map((img, i) => (
				<button
					type="button"
					className={cn('col-span-1 row-span-1')}
					key={img.id}
					onClick={() => lb.openAt(i + 1)}
				>
					{img.url !== '' ? (
						<Image
							src={ipx(img.url, 'w_512')}
							alt={img.description ?? ''}
							className={cn('h-full w-full object-cover', {
								'rounded-tr-xl': i === 1,
								'rounded-br-xl': i === 3,
							})}
							layout="constrained"
							width={512}
							aspectRatio={1}
						/>
					) : (
						<div
							className={cn('h-full w-full bg-muted object-cover', {
								'rounded-tr-xl': i === 1,
								'rounded-br-xl': i === 3,
							})}
						/>
					)}
				</button>
			))}
			<Button
				type="button"
				className="absolute right-4 bottom-4"
				variant="default"
				size="sm"
				onClick={() => lb.openAt(0)}
			>
				<GripHorizontalIcon />
				<span>Show all</span>
			</Button>

			<lb.Component />
		</div>
	);
}
