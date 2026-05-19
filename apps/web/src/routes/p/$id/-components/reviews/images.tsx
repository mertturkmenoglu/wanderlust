import { getRouteApi } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { useAssetsQuery } from './hooks';

type Props = {
	className?: string;
};

export function ReviewImages({ className }: Props) {
	return (
		<SuspenseWrapper>
			<Content className={className} />
		</SuspenseWrapper>
	);
}

type ContentProps = {
	className?: string;
};

function Content({ className }: ContentProps) {
	const route = getRouteApi('/p/$id/');
	const { id } = route.useParams();
	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(0);

	const query = useAssetsQuery(id);

	const images = query.data.assets;
	const showMoreCount = Math.min(images.length - 4, 20);

	return (
		<div
			className={cn(
				'grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-2',
				className,
			)}
		>
			{images.slice(0, 4).map((image, i) => (
				<button
					type="button"
					key={image.id}
					onClick={() => {
						setIndex(() => {
							setOpen(true);
							return i;
						});
					}}
					className="relative"
				>
					<Image
						key={image.id}
						src={image.url}
						alt=""
						className="aspect-square cursor-pointer rounded"
						layout="constrained"
						width={96}
						aspectRatio={1}
					/>
					{i === 3 && images.length > 4 && (
						<div
							className={cn(
								'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
								'size-10 rounded-full bg-primary/90 p-1 text-sm text-white',
								'flex flex-row items-center justify-center gap-0',
							)}
						>
							+{showMoreCount}
						</div>
					)}
				</button>
			))}

			<Lightbox
				open={open}
				close={() => setOpen(false)}
				slides={images.map((img) => ({
					src: img.url,
				}))}
				carousel={{
					finite: true,
				}}
				controller={{
					closeOnBackdropClick: true,
				}}
				styles={{
					container: {
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
					},
				}}
				index={index}
			/>
		</div>
	);
}
