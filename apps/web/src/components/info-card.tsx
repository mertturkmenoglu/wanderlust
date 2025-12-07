import { cn } from '@wanderlust/ui/lib/utils';

type InfoCardProps = {
	className?: string;
	children: React.ReactNode;
};

function InfoCardRoot({ className, children }: InfoCardProps) {
	return (
		<div
			className={cn(
				'flex aspect-video items-center rounded-lg bg-primary/5 p-4',
				className,
			)}
		>
			{children}
		</div>
	);
}

type ContentProps = {
	className?: string;
	children: React.ReactNode;
};

function Content({ className, children }: ContentProps) {
	return (
		<div className={cn('flex items-center gap-4', className)}>{children}</div>
	);
}

type NumberColumnProps = {
	className?: string;
	children: React.ReactNode;
};

function NumberColumn({ className, children }: NumberColumnProps) {
	return (
		<span
			className={cn('font-bold text-3xl text-primary md:text-6xl', className)}
		>
			{children}
		</span>
	);
}

type DescriptionColumnProps = {
	className?: string;
	children: React.ReactNode;
};

function DescriptionColumn({ className, children }: DescriptionColumnProps) {
	return <span className={cn(className)}>{children}</span>;
}

export const InfoCard = {
	Root: InfoCardRoot,
	Content,
	NumberColumn,
	DescriptionColumn,
};
