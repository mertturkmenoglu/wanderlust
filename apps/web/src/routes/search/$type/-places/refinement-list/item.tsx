/** biome-ignore-all lint/a11y/noLabelWithoutControl: it's fine */
import { Checkbox } from '@wanderlust/ui/components/checkbox';
import { cn } from '@wanderlust/ui/lib/utils';
import { useNumberFormatter } from '@/hooks/use-number-formatter';
import { useRefinementListContext } from './context';
import { useItemLabel } from './hooks';
import type { RefinementListItemProps } from './types';

export function RefinementListItem({
	item,
	className,
}: RefinementListItemProps) {
	const ctx = useRefinementListContext();
	const label = useItemLabel(item);
	const numFmt = useNumberFormatter();

	return (
		<li className={cn(className)}>
			<label className="flex w-full items-center">
				<Checkbox
					checked={item.isRefined}
					onCheckedChange={() => ctx.rl.refine(item.value)}
				/>
				<span className="ml-2 line-clamp-1 w-full text-left text-sm capitalize">
					{label}
				</span>
				<span className="ml-px text-muted-foreground text-sm">
					{' '}
					({numFmt.format(item.count)})
				</span>
			</label>
		</li>
	);
}
