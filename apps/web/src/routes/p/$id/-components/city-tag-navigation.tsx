import { useLoaderData } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { TagNavigation } from '@/components/tag-navigation';

type Props = {
	className?: string;
};

export function CityTagNavigation({ className }: Props) {
	const { place } = useLoaderData({ from: '/p/$id/' });

	return (
		<div className={cn('relative', className)}>
			<Image
				src={place.address.city.image}
				alt={place.address.city.name}
				className="my-4 h-64 w-full rounded object-cover"
				height={256}
				width={2000}
			/>
			<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
				<div
					className={buttonVariants({
						variant: 'sky',
						size: 'lg',
						className: 'mx-auto hover:bg-sky!',
					})}
				>
					Discover Places in {place.address.city.name}
				</div>
				<div className="mx-auto mt-4 w-fit rounded bg-muted px-8 py-2">
					<TagNavigation cityName={place.address.city.name} />
				</div>
			</div>
		</div>
	);
}
