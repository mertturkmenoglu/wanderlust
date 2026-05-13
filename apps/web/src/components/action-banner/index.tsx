import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';

type Props = {
	className?: string;
	image: string;
	alt: string;
	message: React.ReactNode;
	imgClassName?: string;
	lefty?: boolean;
};

export function ActionBanner({
	className,
	image,
	alt,
	message,
	imgClassName,
	lefty = true,
}: Props) {
	return (
		<div
			className={cn(
				'mx-auto flex max-w-4xl flex-col items-center rounded-xl border border-border md:flex-row',
				{
					'md:flex-row-reverse': !lefty,
				},
				className,
			)}
		>
			<Image
				src={image}
				className={cn(
					'aspect-square w-full rounded-t-xl object-cover md:aspect-square md:max-w-md md:rounded-t-none',
					{
						'md:rounded-l-xl md:rounded-tl-xl': lefty,
						'md:rounded-r-xl md:rounded-tr-xl': !lefty,
					},
					imgClassName,
				)}
				alt={alt}
				layout="constrained"
				height={300}
				aspectRatio={1}
			/>
			<div className="p-8 md:p-4 lg:p-8">
				<div className="">{message} dsgdfhfdhd</div>
			</div>
		</div>
	);
}
