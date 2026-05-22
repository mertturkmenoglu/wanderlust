import { cn } from '@wanderlust/ui/lib/utils';

export type GradientBannerProps = {
	left?: React.ReactNode;
	right?: React.ReactNode;
	classNames?: Partial<{
		root: string;
		left: string;
		right: string;
	}>;
};

export function GradientBanner({
	left,
	right,
	classNames,
}: GradientBannerProps) {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-between gap-8 p-8 md:flex-row md:p-16',
				'h-60 bg-radial-[at_25%_25%] from-warning/50 to-warning text-midnight',
				classNames?.root,
			)}
		>
			{left && <div className={cn(classNames?.left)}>{left}</div>}

			{right && <div className={cn(classNames?.right)}>{right}</div>}
		</div>
	);
}
