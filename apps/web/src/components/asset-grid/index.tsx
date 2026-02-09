import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { useMemo, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import { ipx } from '@/lib/ipx';

export type Props = {
	className?: string;
	assets: Array<{
		id: number;
		url: string;
		description: string;
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

	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(0);

	if (!first) {
		return null;
	}

	return (
		<div
			className={cn(
				'relative grid h-64 grid-cols-4 grid-rows-2 gap-2 rounded-xl md:h-96 lg:h-[512px]',
				className,
			)}
		>
			<div className="col-span-2 row-span-2">
				<button
					type="button"
					className="h-full w-full rounded-l-xl object-cover"
					onClick={() =>
						setIndex(() => {
							setOpen(true);
							return 0;
						})
					}
				>
					<img
						src={ipx(first.url, 'w_1024')}
						alt={first.description ?? ''}
						className="h-full w-full rounded-l-xl object-cover"
					/>
				</button>
			</div>
			{rest.map((asset, i) => (
				<button
					type="button"
					className={cn('col-span-1 row-span-1')}
					key={asset.id}
					onClick={() => {
						if (asset.url !== '') {
							setIndex(() => {
								setOpen(true);
								return i + 1;
							});
						}
					}}
				>
					{asset.url !== '' ? (
						<img
							src={ipx(asset.url, 'w_512')}
							alt={asset.description ?? ''}
							className={cn('h-full w-full object-cover', {
								'rounded-tr-xl': i === 1,
								'rounded-br-xl': i === 3,
							})}
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
				onClick={() =>
					setIndex(() => {
						setOpen(true);
						return 0;
					})
				}
			>
				See all
			</Button>

			<Lightbox
				open={open}
				close={() => setOpen(false)}
				plugins={[Thumbnails]}
				slides={assets.map((asset) => ({
					src: asset.url,
				}))}
				animation={{ fade: 0 }}
				controller={{
					closeOnPullDown: true,
					closeOnBackdropClick: true,
				}}
				index={index}
				styles={{
					container: {
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
					},
				}}
			/>
		</div>
	);
}
