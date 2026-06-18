import { cn } from '@wanderlust/ui/lib/utils';

function SettingsFieldRoot({
	children,
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div className={cn('space-y-1', className)} {...props}>
			{children}
		</div>
	);
}

function SettingsFieldLabel({
	children,
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div className={cn('font-medium', className)} {...props}>
			{children}
		</div>
	);
}

function SettingsFieldDescription({
	children,
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			className={cn('mt-1 text-muted-foreground text-sm', className)}
			{...props}
		>
			{children}
		</div>
	);
}

export const SettingsField = {
	Root: SettingsFieldRoot,
	Label: SettingsFieldLabel,
	Description: SettingsFieldDescription,
};
