import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { Logo } from '../logo';
import type { Props, Variant } from './types';

export function AppMessage({
	classNames,
	error,
	success,
	empty,
	backLink = false,
	logoProps,
}: Readonly<Props>) {
	const variant: Variant = error ? 'error' : success ? 'success' : 'empty';

	const message =
		variant === 'error' ? error : variant === 'success' ? success : empty;

	const showBackLink = backLink !== false && backLink !== undefined;

	return (
		<div
			className={cn(
				'flex h-full flex-col items-center justify-center space-y-4',
				classNames?.root,
			)}
			data-testid="app-message"
			data-variant={variant}
		>
			<Logo
				grayscale={variant !== 'success'}
				className={cn(classNames?.logo)}
				variant="default"
				{...logoProps}
			/>
			<div
				className={cn(
					'font-semibold text-lg',
					{
						'text-destructive': variant === 'error',
						'text-primary': variant === 'success',
						'text-muted-foreground': variant === 'empty',
					},
					classNames?.[variant],
				)}
			>
				{message}
			</div>
			{showBackLink && (
				<Link
					{...backLink}
					className={buttonVariants({
						variant: 'link',
						className: cn(
							{
								'text-destructive': variant === 'error',
							},
							classNames?.backLink,
						),
					})}
				>
					{backLink.text}
				</Link>
			)}
		</div>
	);
}
