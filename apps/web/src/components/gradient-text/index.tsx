import { cn } from '@wanderlust/ui/lib/utils';

type Props = Omit<React.ComponentProps<'span'>, 'children'> & {
	text: string;
};

export function GradientText({ className, text, ...props }: Props) {
	return (
		<span
			className={cn(
				'bg-linear-to-r from-primary to-sky-600 bg-clip-text text-transparent',
				className,
			)}
			{...props}
		>
			{text}
		</span>
	);
}
