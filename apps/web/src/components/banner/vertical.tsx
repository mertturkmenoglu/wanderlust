import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { ipx } from '@/lib/ipx';
import { Attribution } from './attribution';

export type VerticalBannerProps = {
	classNames?: Partial<{
		root: string;
		image: string;
		content: string;
	}>;
	image: string;
	alt: string;
	content: React.ReactNode;
	attr?: {
		text: string;
		link: string;
	};
};

export function VerticalBanner({
	classNames,
	image,
	alt,
	content,
	attr,
}: VerticalBannerProps) {
	return (
		<div
			className={cn(
				'relative mx-auto flex max-w-4xl flex-col items-center',
				classNames?.root,
			)}
		>
			<Image
				src={ipx(image, 'w_512')}
				alt={alt}
				className={cn('aspect-square size-80', classNames?.image)}
				layout="constrained"
				width={300}
				aspectRatio={1}
			/>

			<div className={cn(classNames?.content)}>{content}</div>
			{attr && <Attribution text={attr.text} link={attr.link} />}
		</div>
	);
}
