import { Link, type LinkOptions } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { Logo, type LogoProps } from '../logo';

type BackLink = LinkOptions & {
	text: string;
};

type Props = {
	classNames?: Partial<{
		root: string;
		logo: string;
		error: string;
		success: string;
		empty: string;
		backLink: string;
	}>;
	error?: React.ReactNode;
	success?: React.ReactNode;
	empty?: React.ReactNode;
	backLink?: BackLink | false;
	logoProps?: Partial<LogoProps>;
};

type Variant = 'error' | 'success' | 'empty';

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
