import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { ipx } from '@/lib/ipx';

type Props = {
	image: string;
	className?: string;
	imageClassName?: string;
	alt: string;
	content: React.ReactNode;
};

export function VerticalBanner({
	image,
	className,
	imageClassName,
	alt,
	content,
}: Props) {
	return (
		<div
			className={cn('mx-auto flex max-w-4xl flex-col items-center', className)}
		>
			<Image
				src={ipx(image, 'w_512')}
				alt={alt}
				className={cn('aspect-square size-80', imageClassName)}
				layout="constrained"
				width={300}
				aspectRatio={1}
			/>

			<div>{content}</div>
		</div>
	);
}
