/** biome-ignore-all lint/suspicious/noArrayIndexKey: TODO */
import { cn } from '@wanderlust/ui/lib/utils';
import { usePlaceCardContext } from './context';

export function DotNavigation() {
	const ctx = usePlaceCardContext();
	const count = ctx.place.assets.length;

	return (
		<div className="absolute right-0 bottom-2 left-0 flex justify-center gap-1 opacity-0 duration-200 group-hover:opacity-80">
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={`dot-navigation-${i}`}
					className={cn('size-2 rounded-full border border-border', {
						'bg-primary': i === ctx.index,
					})}
				/>
			))}
		</div>
	);
}
