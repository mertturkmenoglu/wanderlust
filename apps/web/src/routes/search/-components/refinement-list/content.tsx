import { cn } from '@wanderlust/ui/lib/utils';
import { useRefinementListContext } from './context';
import { RLInput } from './input';
import { RefinementListItem } from './item';
import { ShowMore } from './show-more';
import type { RefinementListProps } from './types';

export function Content({ className }: RefinementListProps) {
	const ctx = useRefinementListContext();

	return (
		<div className={cn('my-2 flex flex-col items-start', className)}>
			<div className="text-left font-semibold tracking-tight">{ctx.title}</div>

			<RLInput />

			<ul className={cn('mt-2 w-full space-y-2')}>
				{ctx.rl.items.map((item) => (
					<RefinementListItem key="item.label" item={item} className="w-full" />
				))}
			</ul>

			<ShowMore />
		</div>
	);
}
