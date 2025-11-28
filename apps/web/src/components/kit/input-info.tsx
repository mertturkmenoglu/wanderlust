import { cn } from '@/lib/utils';

type Props = React.HTMLAttributes<HTMLDivElement> & {
	text: string;
};

export function InputInfo({ text, className, ...props }: Props) {
	return (
		<div
			className={cn('mt-1 text-muted-foreground text-xs', className)}
			{...props}
		>
			{text}
		</div>
	);
}
