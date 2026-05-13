import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type Props = {
	className?: string;
	image: string;
	alt: string;
	message: React.ReactNode;
	imgClassName?: string;
};

export function OverlayBanner({
	className,
	image,
	alt,
	message,
	imgClassName,
}: Props) {
	const isMobile = useIsMobile();

	return (
		<div
			className={cn(
				'relative flex items-center justify-center rounded-md bg-black/90',
				className,
			)}
		>
			<Image
				src={image}
				className={cn(
					'aspect-[2] h-full rounded-md object-cover opacity-70 md:aspect-[5]',
					imgClassName,
				)}
				alt={alt}
				layout="constrained"
				aspectRatio={isMobile ? 2 : 5}
				height={300}
			/>
			<div className="absolute bottom-2 left-2 rounded-md px-4 py-2 md:bottom-8 md:left-8 md:px-8 md:py-4">
				<div className="font-bold text-base text-white md:text-2xl">
					{message}
				</div>
			</div>
		</div>
	);
}
