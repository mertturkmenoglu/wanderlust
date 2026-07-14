import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { Attribution } from '@/components/attribution';
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
				'relative grid grid-cols-1 gap-4 rounded bg-muted md:h-48 md:grid-cols-2 md:gap-0',
				className,
			)}
		>
			<div className="order-last flex h-full w-full flex-col items-center justify-center px-8 text-center md:order-first">
				<h2 className="text-2xl">{category.displayName}</h2>
				<div className="text-sm">{category.description}</div>
			</div>
			<Image
				src={category.image}
				alt={category.displayName}
				layout="fullWidth"
				className="h-48 w-full rounded-t object-cover md:rounded-t-none md:rounded-r"
				height={192}
			/>
			<Attribution attributions={category.attributions} />
		</div>
	);
}
