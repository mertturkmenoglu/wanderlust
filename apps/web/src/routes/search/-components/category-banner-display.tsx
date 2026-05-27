import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { useCurrentCategory } from './hooks';

type Props = {
	className?: string;
};

export function CategoryBannerDisplay({ className }: Props) {
	const category = useCurrentCategory();

	if (!category) {
		return null;
	}

	return (
		<div
			className={cn(
				'grid grid-cols-1 gap-4 rounded bg-muted md:h-48 md:grid-cols-2 md:gap-0',
				className,
			)}
		>
			<div className="order-last flex h-full w-full items-center justify-center md:order-first">
				<h2 className="text-2xl">{category.name}</h2>
			</div>
			<Image
				src={category.image}
				alt={category.name}
				layout="fullWidth"
				className="h-48 w-full rounded-t object-cover md:rounded-t-none md:rounded-r"
				height={192}
			/>
		</div>
	);
}
