import { Image } from '@unpic/react';
import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { GripHorizontalIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useAssetLightbox } from '@/hooks/use-asset-lightbox';
import { ipx } from '@/lib/ipx';

export type Props = {
	className?: string;
	assets: Array<{
		id: number;
		url: string;
		description: string | null;
		order: number;
	}>;
};

export function AssetGrid({ className, assets: unsortedAssets }: Props) {
	const assets = unsortedAssets.sort((a, b) => a.order - b.order);
	const first = assets[0];

	const rest = useMemo(() => {
		const slice = assets.slice(1, 5);

		if (slice.length < 4) {
			const pad = 4 - slice.length;

			for (let i = 0; i < pad; i++) {
				slice.push({
					id: Math.random(),
					url: '',
					description: '',
					order: 0,
				});
			}
		}

		return slice;
	}, [assets]);

	const lb = useAssetLightbox(assets);

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
						height={1024}
						aspectRatio={16 / 9}
					/>
				</button>
			</div>
			{rest.map((asset, i) => (
				<button
					type="button"
					className={cn('col-span-1 row-span-1')}
					key={asset.id}
					onClick={() => lb.openAt(i + 1)}
				>
					{asset.url !== '' ? (
						<Image
							src={ipx(asset.url, 'w_512')}
							alt={asset.description ?? ''}
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
