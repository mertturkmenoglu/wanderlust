import { cn } from '@wanderlust/ui/lib/utils';

export const rteStyles = cn(
	'resize-none bg-transparent py-3 shadow-none',
	'focus-visible:ring-0 dark:bg-transparent',
	'field-sizing-content min-h-18 w-full rounded-md border border-input px-3 text-base md:min-h-36',
	'outline-none transition-[color,box-shadow] placeholder:text-muted-foreground',
	'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
	'disabled:cursor-not-allowed disabled:opacity-50',
	'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
	'md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
);
