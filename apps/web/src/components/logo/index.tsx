import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';

export type LogoProps = {
	variant?: 'default' | 'large' | 'medium' | 'small' | 'xs';
	grayscale?: boolean;
	className?: string;
};

export function Logo({
	variant = 'default',
	grayscale = false,
	className,
	...props
}: LogoProps) {
	const height = (() => {
		switch (variant) {
			case 'xs':
				return 32;
			case 'small':
				return 48;
			case 'medium':
				return 64;
			case 'large':
				return 192;
			default:
				return 96;
		}
	})();

	return (
		<Image
			src="/logo.png"
			alt="Wanderlust logo"
			layout="constrained"
			className={cn(
				{
					grayscale: grayscale,
					'size-8 min-h-8 min-w-8': variant === 'xs',
					'size-12 min-h-12 min-w-12': variant === 'small',
					'size-16 min-h-16 min-w-16': variant === 'medium',
					'size-24 min-h-24 min-w-24': variant === 'default',
					'size-48 min-h-48 min-w-48': variant === 'large',
				},
				className,
			)}
			height={height}
			aspectRatio={1}
			{...props}
		/>
	);
}
