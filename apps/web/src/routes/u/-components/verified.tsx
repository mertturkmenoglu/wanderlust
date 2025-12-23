import { cn } from '@wanderlust/ui/lib/utils';
import { BadgeCheckIcon } from 'lucide-react';

type Props = {
	className?: string;
};

export function Verified({ className }: Props) {
	return (
		<div className={cn('flex items-center gap-2', className)}>
			<BadgeCheckIcon className="size-6 text-primary" />
			<span className="text-gray-500 text-sm">Verified</span>
		</div>
	);
}
