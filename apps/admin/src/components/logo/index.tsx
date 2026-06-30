import { cn } from '@wanderlust/ui/lib/utils';

type Props = {
	variant?: 'default' | 'large' | 'medium' | 'small';
	grayscale?: boolean;
	className?: string;
};

export function Logo({
	variant = 'default',
	grayscale = false,
	className,
	...props
}: Props) {
	return (
		<img
			src="/logo.png"
			alt="Wanderlust logo"
			className={cn(
				{
					grayscale: grayscale,
					'size-12 min-h-12 min-w-12': variant === 'small',
					'size-16 min-h-16 min-w-16': variant === 'medium',
					'size-24 min-h-24 min-w-24': variant === 'default',
					'size-48 min-h-48 min-w-48': variant === 'large',
				},
				className,
			)}
			{...props}
		/>
	);
}
