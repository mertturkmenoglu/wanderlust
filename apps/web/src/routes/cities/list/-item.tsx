import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { ipx } from '@/lib/ipx';
import type { Outputs } from '@/lib/orpc';

type Props = {
	city: Outputs['cities']['list']['cities'][number];
};

export function CityItem({ city }: Props) {
	return (
		<Link
			to="/cities/$"
			params={{
				_splat: `${city.id}/${city.name}`,
			}}
			className={cn(
				'group overflow-hidden rounded-md border shadow-sm outline-none transition-all hover:shadow-md',
				'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
				'hover:border-ring hover:ring-2 hover:ring-primary hover:ring-offset-2',
			)}
		>
			<div className="relative">
				<Image
					src={ipx(city.image, 'w_512')}
					alt=""
					className="aspect-video w-full object-cover"
					layout="constrained"
					width={512}
					aspectRatio={16 / 9}
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
				<div className="absolute right-0 bottom-0 left-0 p-2">
					<div className="text-white">{city.name}</div>
				</div>
			</div>
		</Link>
	);
}
