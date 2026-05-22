import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { Attribution } from './attribution';

export type ActionBannerProps = {
	classNames?: Partial<{
		root: string;
		image: string;
		message: string;
		messageContainer: string;
	}>;
	image: string;
	alt: string;
	message: React.ReactNode;
	lefty?: boolean;
	attr?: {
		text: string;
		link: string;
	};
};

export function ActionBanner({
	classNames,
	image,
	alt,
	message,
	lefty = false,
	attr,
}: ActionBannerProps) {
	return (
		<div
			className={cn(
				'relative mx-auto flex max-w-4xl flex-col items-center rounded-xl border border-border md:flex-row',
				{
					'md:flex-row-reverse': !lefty,
				},
				classNames?.root,
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
					classNames?.image,
				)}
				alt={alt}
				layout="constrained"
				height={300}
				aspectRatio={1}
			/>
			<div className={cn('p-8 md:p-4 lg:p-8', classNames?.messageContainer)}>
				<div className={cn(classNames?.message)}>{message}</div>
			</div>

			{attr && <Attribution text={attr.text} link={attr.link} />}
		</div>
	);
}
