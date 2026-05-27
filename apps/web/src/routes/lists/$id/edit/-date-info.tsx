import { cn } from '@wanderlust/ui/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { useListQuery } from './-hooks';

type Props = {
	className?: string;
};

export function DateInfo({ className }: Props) {
	const query = useListQuery();
	const { list } = query.data;

	return (
		<div
			className={cn(
				'flex items-center gap-2 text-muted-foreground text-xs',
				className,
			)}
		>
			<div title={new Date(list.updatedAt).toLocaleString()}>
				Last Updated: {formatDistanceToNow(list.updatedAt, { addSuffix: true })}
			</div>
			<div title={new Date(list.createdAt).toLocaleString()}>
				Created: {format(list.createdAt, 'PPP')}
			</div>
		</div>
	);
}
