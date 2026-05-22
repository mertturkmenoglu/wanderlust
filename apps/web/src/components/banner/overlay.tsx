import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Attribution } from './attribution';

export type OverlayBannerProps = {
	classNames?: Partial<{
		root: string;
		image: string;
		messageContainer: string;
		message: string;
	}>;
	image: string;
	alt: string;
	message: React.ReactNode;
	attr?: {
		text: string;
		link: string;
	};
};

export function OverlayBanner({
	classNames,
	image,
	alt,
	message,
	attr,
}: OverlayBannerProps) {
	const isMobile = useIsMobile();

	return (
		<div
			className={cn(
				'relative flex items-center justify-center rounded-md',
				classNames?.root,
			)}
		>
			<Image
				src={image}
				className={cn(
					'aspect-[2] h-full rounded-md object-cover md:aspect-[3]',
					classNames?.image,
				)}
				alt={alt}
				layout="constrained"
				aspectRatio={isMobile ? 2 : 5}
				height={400}
			/>
			<div
				className={cn(
					'absolute right-2 bottom-2 rounded-md px-4 py-2 md:right-8 md:bottom-8 md:px-8 md:py-4',
					classNames?.messageContainer,
				)}
			>
				<div
					className={cn(
						'text-base text-midnight md:text-2xl',
						classNames?.message,
					)}
				>
					{message}
				</div>
			</div>

			{attr && <Attribution text={attr.text} link={attr.link} />}
		</div>
	);
}
