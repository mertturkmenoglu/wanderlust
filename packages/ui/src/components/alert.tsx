import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '../lib/utils';

const alertVariants = cva(
	'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
	{
		variants: {
			variant: {
				default: 'text-card-foreground',
				destructive:
					'text-destructive *:data-[slot=alert-description]:text-destructive/90 dark:text-destructive-foreground *:dark:data-[slot=alert-description]:text-destructive-foreground [&>svg]:text-current',
				warning:
					'text-warning-foreground *:data-[slot=alert-description]:text-warning-foreground/90 dark:text-warning *:dark:data-[slot=alert-description]:text-warning [&>svg]:text-current',
			},
			fill: {
				card: 'bg-card',
				ghost: null,
			},
		},
		compoundVariants: [
			{
				variant: 'default',
				fill: 'ghost',
				className: 'bg-card/90',
			},
			{
				variant: 'destructive',
				fill: 'ghost',
				className: 'border-destructive bg-destructive/5',
			},
			{
				variant: 'warning',
				fill: 'ghost',
				className: 'border-warning bg-warning/5',
			},
		],
		defaultVariants: {
			variant: 'default',
			fill: 'card',
		},
	},
);

function Alert({
	className,
	variant,
	fill,
	...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
	return (
		<div
			data-slot="alert"
			role="alert"
			className={cn(alertVariants({ variant, fill }), className)}
			{...props}
		/>
	);
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="alert-title"
			className={cn(
				'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
				className,
			)}
			{...props}
		/>
	);
}

function AlertDescription({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				'col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed',
				className,
			)}
			{...props}
		/>
	);
}

export { Alert, AlertDescription, AlertTitle };
