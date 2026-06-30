import { cn } from '@wanderlust/ui/lib/utils';

type Props = React.ComponentPropsWithoutRef<'div'>;

export function Container({ className, ...props }: Props) {
	return (
		<div
			className={cn(
				'mx-auto my-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8',
				className,
			)}
			{...props}
		/>
	);
}
