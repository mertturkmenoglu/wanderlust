import { cn } from '@wanderlust/ui/lib/utils';

type Props = React.PropsWithChildren<{
	className?: string;
}>;

export function Aside({ children, className }: Props) {
	return (
		<aside className={cn('flex flex-col gap-4', className)}>{children}</aside>
	);
}
