import { cn } from '@wanderlust/ui/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type Props = {
	date: Date;
	className?: string;
};

export function RelativeTime({ date, className }: Props) {
	return (
		<span className={cn('', className)} title={date.toLocaleString()}>
			{formatDistanceToNow(date, { addSuffix: true })}
		</span>
	);
}
